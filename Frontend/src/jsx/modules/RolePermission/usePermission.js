import { useEffect, useState } from "react";
import { getMyPermissions } from "../pages/roles/roleApi";

const usePermission = () => {
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const res = await getMyPermissions();
      setPermissions(res?.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const can = (key) => {
    return permissions.some((p) => p.key === key);
  };

  return { can, permissions };
};

export default usePermission;