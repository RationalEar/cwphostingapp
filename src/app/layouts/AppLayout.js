import React from 'react';
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import MainContent from "../../components/MainContent";
import Footer from "../../components/Footer";
import Notifications from "../../components/common/Notifications";

function AppLayout(props) {
	return (
		<React.Fragment>
			<Sidebar />
			<Header {...props} />
			<MainContent />
			<div className="overlay toggle-icon" />
			<Footer />
			<Notifications />
		</React.Fragment>
	);
}

export default AppLayout;