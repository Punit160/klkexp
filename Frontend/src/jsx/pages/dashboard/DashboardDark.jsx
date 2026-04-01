import { useContext, useEffect } from 'react'; 
import { ThemeContext } from '../../../context/ThemeContext';
import AdminDashboard from './Admin/AdminDashboard';

const DashboardDark = () => {
	const { changeBackground,  } = useContext(ThemeContext);
	useEffect(() => {
		changeBackground({ value: "dark", label: "Dark" });		
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	
	return (
		<>
			<AdminDashboard />
		</>
	)
}
export default DashboardDark;