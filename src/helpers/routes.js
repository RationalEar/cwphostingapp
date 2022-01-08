import React from "react";
const Dashboard = React.lazy( () => import('../components/admin/Dashboard') )
const Users = React.lazy( () => import('../components/admin/users/Users') )
const Roles = React.lazy( () => import('../components/admin/users/roles/Roles') )
const Pages = React.lazy( () => import('../components/admin/pages/Pages') )

const routes = [
	{path: '/', name: 'Dashboard', exact:true, component: Dashboard},
	{path: '/users', name: 'Users', exact:true, component: Users},
	{path: '/roles', name: 'Roles', exact:true, component: Roles},
	{path: '/pages', name: 'Pages', exact:true, component: Pages},
]

export default routes