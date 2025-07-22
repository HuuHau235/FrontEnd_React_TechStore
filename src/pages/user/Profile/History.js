import React, { useEffect, useState } from "react";
	import Sidebar from "../../../pages/user/Sidebar/Sidebar";
  import HistoryContent from "../../../components/user/Profile/Hisroty";
import "../../../pages/user/Profile/History.css";
import axios from "axios";
import LoadingSpinner from "../../../components/common/LoadingSpinner";

const History = () => {
  const [avatar, setAvatar] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const userIdRes = await axios.get("https://backendlaraveltechstore-production.up.railway.app/api/user/getUserId", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        const userId = userIdRes.data.userId;

        const userRes = await axios.get(`https://backendlaraveltechstore-production.up.railway.app/api/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        const userData = userRes.data.data;
        setAvatar(userData.avatar || "https://example.com/default-avatar.png");
        setUsername(userData.name || "N/A");
        setEmail(userData.email || "N/A");
      } catch (error) {
        console.error("Error fetching profile for history page:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="history-wrapper">
      <Sidebar avatar={avatar} username={username} email={email} activeMenu="history" />
      <HistoryContent />
    </div>
  );
};

export default History;