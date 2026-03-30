/* eslint-disable react-hooks/exhaustive-deps */

import { useContext, useEffect } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
// import CommanSection from "./CommanSection";
// import AdminDashboard from "./AdminDashboard";
import UserCommanSection from "./UserCommanSection";

function Home() {
	const { changeBackground } = useContext(ThemeContext);
	useEffect(() => {
		changeBackground({ value: "light", label: "Light" });
	}, []);

	return (
		<>

			{/* <AdminDashboard/> */}
			{/* <CommanSection /> */}
			<UserCommanSection/>
		</>
	)
}
export default Home;