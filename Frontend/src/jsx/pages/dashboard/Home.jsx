/* eslint-disable react-hooks/exhaustive-deps */

import { useContext, useEffect } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import AdminDashboard from "./Admin/AdminDashboard";
import CommanSection from "./Manager/CommanSection";
import UserCommanSection from "./User/UserCommanSection";

function Home() {
	const { changeBackground } = useContext(ThemeContext);
	useEffect(() => {
		changeBackground({ value: "light", label: "Light" });
	}, []);

	return (
		<>

			{/* <AdminDashboard/> */}
			<CommanSection />
			{/* <UserCommanSection/> */}
		</>
	)
}
export default Home;