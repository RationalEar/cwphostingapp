import * as yup from "yup"
import {range} from "lodash";
import React from "react";
import {leftPad} from "../../../../helpers/general";

export const schema = yup.object().shape({
	tenantId: yup.string().required(),
	propertyId: yup.string().required(),
	startDate: yup.date().required(),
	endDate: yup.date().required(),
	billFrom: yup.date().required(),
	currency: yup.string().required(),
	status: yup.string().required(),
	deposit: yup.string().required(),
	amount: yup.string().required(),
	// paymentsDue: yup.string(),
	dueIn: yup.number().required(),
	gracePeriod: yup.number(),
	leaseAgreement: yup.string(),
	// comments: yup.array(),
	paymentSchedule: yup.object().shape({
		cycle: yup.string().required(),
		repeatEvery: yup.number(),
		dayOfWeek: yup.number(),
		dayOfMonth: yup.number(),
		monthOfYear: yup.number()
	})
})

export const paymentSchema = yup.object().shape({
	paymentDate: yup.date().required(),
	amount: yup.number().required(),
	currency: yup.string().required(),
	confirmed: yup.boolean().required(),
	comment: yup.string(),
	paymentMethod: yup.string(),
	exchangeRate: yup.number()
})

const fourToTwenty = range(4, 21).map( n => n+'th' )
const twentyFourToThirty = range(24, 31).map( n => n+'th')

export const days = ['Last day', 'First day', '2nd', '3rd', ...fourToTwenty, '21st', '22nd', '23rd', ...twentyFourToThirty, '31st']
export const daysOfWeek = ['-- select day --', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
export const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
export const paymentsDue = [
	{days:0, label: 'On receipt'},
	{days:1, label: 'Within 1 day'},
	{days:2, label: 'Within 2 days'},
	{days:3, label: 'Within 3 days'},
	{days:5, label: 'Within 5 days'},
	{days:7, label: 'Within 7 days'},
	{days:10, label: 'Within 10 days'},
	{days:14, label: 'Within 14 days'},
	{days:30, label: 'Within 30 days'},
	{days:45, label: 'Within 45 days'},
	{days:60, label: 'Within 60 days'},
	{days:90, label: 'Within 90 days'},
]

export const PaymentSchedule = (props) => {
	const l = props.lease
	const ps = props.lease.paymentSchedule
	let str = '';
	if( ps.repeatEvery>1 ) str = 'Every '+ps.repeatEvery+' '+ps.cycle+'S '
	else if (ps.cycle === 'DAY') str = 'Daily'
	else str = ps.cycle+'LY '
	str = str.toLowerCase()
	
	if(['WEEK','FORTNIGHT'].includes(ps.cycle)) str += 'on ' + daysOfWeek[ps.dayOfWeek] + 's'
	else if(['MONTH','QUARTER','SEMESTER'].includes(ps.cycle)) str += 'on the ' + days[ps.dayOfMonth]
	else if(['YEAR','DECADE'].includes(ps.cycle)) str += 'on the '+days[ps.dayOfMonth]+' of '+monthsOfYear[ps.monthOfYear]
	const s = l.dueIn===1 ? ' day' : ' days'
	const due = "Due in " + l.dueIn + s
	
	return (
		<span>
			{l.currency+' '+Number(l.amount).toFixed(2)}<br />
			<span style={{textTransform:'capitalize'}}>{str}<br/>{due}</span>
		</span>
	)
}

export const ShortDateString = (props) => {
	let date = new Date(props.date)
	return (
		leftPad(date.getDate(),2) + '/' + leftPad(date.getMonth() + 1,2) + '/' + date.getFullYear()
	)
}

export const ShortDateTime = (props) => {
	let date = new Date(props.date)
	const d = leftPad(date.getDate(),2) + '/' + leftPad(date.getMonth() + 1,2) + '/' + date.getFullYear()
	return d + ', '+ leftPad(date.getHours(),2) + ':'+leftPad(date.getMinutes(),2)
}