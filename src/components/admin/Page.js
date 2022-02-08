import { useEffect } from "react";

const Page = (props) => {
	useEffect(() => {
		document.title = window.env.APP_NAME + ( props.title ? ' | ' + props.title : '' )
	}, [props.title]);
	return props.children;
};

export default Page;