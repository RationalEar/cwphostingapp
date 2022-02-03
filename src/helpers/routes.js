import React from "react";
const Home = React.lazy( () => import('../components/client/Home') )
const Dashboard = React.lazy( () => import('../components/admin/Dashboard') )
const Users = React.lazy( () => import('../components/admin/users/Users') )
const Roles = React.lazy( () => import('../components/admin/users/roles/Roles') )
const Pages = React.lazy( () => import('../components/admin/pages/Pages') )
const Profile = React.lazy(() => import('../components/admin/users/Profile'))
const Properties = React.lazy(() => import('../components/admin/properties/Properties'))
const Lease = React.lazy(() => import('../components/admin/properties/leases/Lease'))
const ViewLease = React.lazy(() => import('../components/admin/properties/leases/ViewLease'))
const RentInvoice = React.lazy(() => import('../components/admin/properties/leases/RentInvoice'))

const routes = [
	{path: '/', name: 'Home', exact:true, component: Home},
	{path: '/profile', name: 'Profile', exact:true, component: Profile},
	{path: '/admin', name: 'Dashboard', exact:true, component: Dashboard},
	{path: '/admin/users', name: 'Users', exact:true, component: Users},
	{path: '/admin/roles', name: 'Roles', exact:true, component: Roles},
	{path: '/admin/pages', name: 'Pages', exact:true, component: Pages},
	{path: '/admin/properties', name: 'Properties', exact:false, component: Properties},
	{path: '/admin/leases', name: 'Leases', exact:true, component: Lease},
	{path: '/admin/leases/:id', name: 'View Lease', exact:true, component: ViewLease},
	{path: '/admin/rent-invoice/:id', name: 'View Rent Invoice', exact:true, component: RentInvoice},
	{path: '/leases', name: 'Leases', exact:true, component: Lease},
	{path: '/leases/:id', name: 'View Lease', exact:true, component: ViewLease},
	{path: '/properties', name: 'Properties', exact:false, component: Properties},
]

export default routes