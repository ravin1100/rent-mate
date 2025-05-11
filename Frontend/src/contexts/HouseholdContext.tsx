import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
// import { Household } from '../models/Household';
// import { Member } from "../models/Member";
import { useAuth } from "./AuthContext";
import { dummyHouseholds, dummyHousehold } from "../data/dummyData";

// Create a dedicated API instance for household operations
export const householdApi = axios.create({
  baseURL: "http://192.168.1.8:8080",
  headers: {
    "Content-Type": "application/json",
  },
  allowAbsoluteUrls: false,
});

// Add request interceptor for authentication
householdApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

interface HouseholdContextType {
  household: any;
  members: any[];
  loading: boolean;
  error: string | null;
  availableHouseholds: any[];
  switchHousehold: (householdId: string) => void;
  createHousehold: (name: string) => Promise<void>;
  joinHousehold: (inviteCode: string) => Promise<void>;
  leaveHousehold: () => Promise<void>;
  updateHousehold: (updatedHousehold: any) => Promise<void>;
  generateInviteCode: () => Promise<string>;
  addMember: (email: string) => Promise<void>;
  removeMember: (userId: string) => Promise<void>;
}

const HouseholdContext = createContext<HouseholdContextType | undefined>(
  undefined
);

export const HouseholdProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [household, setHousehold] = useState<any>(dummyHousehold);
  const [members, setMembers] = useState<any[]>(dummyHousehold.members);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableHouseholds, setAvailableHouseholds] =
    useState<any[]>(dummyHouseholds);

  // Switch between households
  const switchHousehold = (householdId: string) => {
    const selectedHousehold = dummyHouseholds.find((h) => h.id === householdId);
    if (selectedHousehold) {
      setHousehold(selectedHousehold);
      setMembers(selectedHousehold.members);
    }
  };

  // Fetch household data when user changes - using dummy data instead of API calls
  useEffect(() => {
    const fetchHousehold = async () => {
      if (!user) {
        setHousehold(null);
        setMembers([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // // Using dummy data instead of API calls
        // setHousehold(dummyHousehold);
        // setMembers(dummyHousehold.members);
        // setAvailableHouseholds(dummyHouseholds);

        const response = await householdApi.get("api/households/my-household");
        setHousehold(response.data);

        // If the household response includes members, use them directly
        if (response.data && response.data.members) {
          setMembers(response.data);
        }
        // Otherwise, fetch members separately if household exists
        else if (response.data && response.data.id) {
          const membersResponse = await householdApi.get(
            `api/households/${response.data.id}/members`
          );
          setMembers(membersResponse.data);
        } else {
          setMembers([]);
        }
      } catch (err: any) {
        if (err.response?.status !== 404) {
          setError(err.response?.data?.message || "Failed to fetch household");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHousehold();
  }, [user]);

  const createHousehold = async (name: string) => {
    try {
      setLoading(true);
      setError(null);
      // Update to use the correct API endpoint
      const response = await householdApi.post("/api/households/create", {
        name,
      });

      // Set household with the response data
      setHousehold(response.data);

      // The response now includes members array, so use that directly
      if (response.data && response.data.members) {
        setMembers(response.data.members);
      } else {
        // Fallback to adding current user as member if members not in response
        if (user) {
          const newMember = {
            id: user.id,
            firstName: user.displayName || user.firstName,
            lastName: user.lastName || "",
            email: user.email,
            role: "ROLE_OWNER",
          };
          setMembers([newMember]);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create household");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const joinHousehold = async (inviteCode: string) => {
    try {
      setLoading(true);
      setError(null);
      // Update to use the correct API endpoint
      const response = await householdApi.post(
        `/api/households/join?inviteCode=${inviteCode}`
      );

      // Set household with the response data
      setHousehold(response.data);

      // The response now includes members array, so use that directly
      if (response.data && response.data.members) {
        setMembers(response.data.members);
      } else {
        // Fallback to fetching members if not included in response
        if (response.data && response.data.id) {
          try {
            const membersResponse = await householdApi.get(
              `/api/households/${response.data.id}/members`
            );
            setMembers(membersResponse.data || []);
          } catch (memberErr) {
            console.error("Failed to fetch members after joining:", memberErr);
            setMembers([]);
          }
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to join household");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const leaveHousehold = async () => {
    try {
      setLoading(true);
      setError(null);
      await householdApi.post("api/households/leave");
      setHousehold(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to leave household");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addMember = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await householdApi.post("api/households/members", {
        email,
      });
      setHousehold(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add member");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeMember = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await householdApi.delete(
        `api/households/members/${userId}`
      );
      setHousehold(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to remove member");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Add new functions for household settings
  const updateHousehold = async (updatedHousehold: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await householdApi.put(
        `api/households/${updatedHousehold.id}`,
        updatedHousehold
      );
      setHousehold(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update household");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const generateInviteCode = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await householdApi.post(
        `api/households/${household?.id}/invite-code`
      );
      const newHousehold = {
        ...household,
        inviteCode: response.data.inviteCode,
      } as any;
      setHousehold(newHousehold);
      return response.data.inviteCode;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to generate invite code");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <HouseholdContext.Provider
      value={{
        household,
        members,
        loading,
        error,
        availableHouseholds,
        switchHousehold,
        createHousehold,
        joinHousehold,
        leaveHousehold,
        updateHousehold,
        generateInviteCode,
        addMember,
        removeMember,
      }}
    >
      {children}
    </HouseholdContext.Provider>
  );
};

export const useHousehold = () => {
  const context = useContext(HouseholdContext);
  if (context === undefined) {
    throw new Error("useHousehold must be used within a HouseholdProvider");
  }
  return context;
};
