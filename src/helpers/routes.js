import React from "react";
const Dashboard = React.lazy( () => import('../components/Dashboard') )
const Users = React.lazy( () => import('../components/users/Users') )
const Pages = React.lazy( () => import('../components/pages/Pages') )

const routes = [
	{path: '/', name: 'Dashboard', exact:true, component: Dashboard},
	{path: '/users', name: 'Users', exact:true, component: Users},
	{path: '/pages', name: 'Pages', exact:true, component: Pages},
]

export default routes