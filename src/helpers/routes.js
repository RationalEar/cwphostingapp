import React from "react";
const Dashboard = React.lazy( () => import('../components/admin/Dashboard') )
const Users = React.lazy( () => import('../components/admin/users/Users') )
const Roles = React.lazy( () => import('../components/admin/users/roles/Roles') )
const Pages = React.lazy( () => import('../components/admin/pages/Pages') )
const Profile = React.lazy(() => import('../components/admin/users/Profile'))
const Properties = React.lazy(() => import('../components/admin/properties/Properties'))

const routes = [
	{path: '/', name: 'Dashboard', exact:true, component: Dashboard},
	{path: '/users', name: 'Users', exact:true, component: Users},
	{path: '/roles', name: 'Roles', exact:true, component: Roles},
	{path: '/pages', name: 'Pages', exact:true, component: Pages},
	{path: '/profile', name: 'Profile', exact:true, component: Profile},
	{path: '/properties', name: 'Properties', exact:false, component: Properties},
]

export default routes