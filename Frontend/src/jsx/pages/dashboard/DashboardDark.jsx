import { useContext, useEffect } from 'react'; 
import { ThemeContext } from '../../../context/ThemeContext';
import CommanSection from './Manager/CommanSection';

const DashboardDark = () => {
	const { changeBackground,  } = useContext(ThemeContext);
	useEffect(() => {
		changeBackground({ value: "dark", label: "Dark" });		
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	
	return (
		<>
			<CommanSection />
		</>
	)
}
export default DashboardDark;