/* eslint-disable react-hooks/exhaustive-deps */

import { useContext, useEffect } from "react";
// import CommanSection from "./CommanSection";
import { ThemeContext } from "../../../context/ThemeContext";
import UserCommanSection from "./UserCommanSection";

function Home() {
	const { changeBackground } = useContext(ThemeContext);
	useEffect(() => {
		changeBackground({ value: "light", label: "Light" });
	}, []);

	return (
		<>
			{/* <CommanSection /> */}
			<UserCommanSection/>
		</>
	)
}
export default Home;