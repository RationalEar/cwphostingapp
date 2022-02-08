import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {initialContent} from "./pdfHtml";
import {pdfStyles} from "./pdfStyles";
import {Doughnut} from "react-chartjs-2";
import {ShortDateString} from "./leaseFields";
import Frame from "react-frame-component";
import {ArcElement, Chart as ChartJS, Legend, Tooltip} from "chart.js";
import {get_axios_error} from "../../../helpers/general";
import {setMessage, setWarning} from "../../../features/notifications/NotificationSlice";
import {useDispatch} from "react-redux";

const ReportFrame = ({frameRef, leaseId, tenantId, token, onReadyCallback}) => {
	const dispatch = useDispatch()
	const canvasRef = useRef(null)
	const [report, setReport] = useState()
	const [chartData, setChartData] = useState()
	const [reportFetched, setReportFetched] = useState()
	
	ChartJS.register(ArcElement, Tooltip, Legend)
	
	const getReport = useCallback(()=>{
		let url = ''
		if( leaseId ) url = '/lease/'+leaseId+'/report'
		else if( tenantId ) url = '/report'
		let config = {}
		if(url==='') return
		else if(token && tenantId){
			config = {headers: { ReportToken: token }}
		}
		setMessage('')
		window.axios.get( url, config )
			.then(response=>{
				setReport(response.data)
				setupChart(response.data)
				if(onReadyCallback){
					setTimeout(onReadyCallback, 2000)
				}
			})
			.catch(error=>{
				const msg = get_axios_error(error)
				dispatch(setWarning( msg.message ))
				setMessage(msg.message)
			})
			.finally(()=>{
				setReportFetched(true)
			})
	},[dispatch, leaseId, onReadyCallback, tenantId, token])
	
	useEffect(()=>{
		if(!reportFetched){
			getReport()
		}
	},[getReport, reportFetched])
	
	const setupChart = (data) => {
		const d = {
			labels: data.labels,
			datasets: [
				{
					label: 'Payments Report',
					data: [
						Number(data.paidOnTimeP).toFixed(1),
						Number(data.gracePeriodP).toFixed(1),
						Number(data.paidLateP).toFixed(1),
						Number(data.partiallyPaidP).toFixed(1),
						Number(data.noPaymentP).toFixed(1)
					],
					backgroundColor: data.colors,
					borderColor: data.colors,
					borderWidth: 1,
					cutout: '70%',
				},
			],
		}
		setChartData(d)
	}
	
	const outLabels = useMemo(()=>{
		return {
			id: 'outLabels',
			afterDraw(chart) {
				const {ctx, chartArea:{width,height}} = chart
				chart.data.datasets.forEach((dataset, i)=>{
					chart.getDatasetMeta(i).data.forEach((dataPoint, index)=>{
						if(dataset.data[index]>0) {
							const {x, y} = dataPoint.tooltipPosition()
							// ctx.fillStyle = dataset.backgroundColor[index]
							// ctx.fill()
							// ctx.fillRect(x,y, 10, 10)
							const halfHeight = height / 2
							const halfWidth = width / 2
							// console.log(chart.data.labels[index], ': Width = ', width,' halfWidth = ', halfWidth,' X = ', x)
							const xLine = x - 75 >= halfWidth ? x + 20 : x - 20
							const yLine = y - 60 >= halfHeight ? y + 20 : y - 20
							const xLine2 = x - 75 >= halfWidth ? xLine + 15 : xLine - 15
							
							// console.log(dataset.data[index])
							// draw line
							ctx.beginPath()
							ctx.moveTo(x, y)
							ctx.lineTo(xLine, yLine)
							ctx.lineTo(xLine2, yLine)
							ctx.strokeStyle = dataset.backgroundColor[index]
							ctx.stroke()
							
							// draw text
							// const textWidth = ctx.measureText(chart.data.labels[index])
							ctx.font = '15px Arial'
							
							// text position
							const textSpacing = x - 75 >= halfWidth ? 5 : -5
							ctx.textAlign = x - 75 >= halfWidth ? 'left' : 'right'
							ctx.textBaseline = 'middle'
							// ctx.fillText(chart.data.labels[index] + ' ('+dataset.data[index]+'%)', xLine2 + textSpacing, yLine)
							ctx.fillText(dataset.data[index] + '%', xLine2 + textSpacing, yLine)
							// ctx.fillText(dataset.data[index]+'%', x , y)
						}
					})
				})
			}
		}
	},[])
	
	const chartOptions = {
		maintainAspectRatio: false,
		layout: {
			padding:{
				left: 100,
				right: 100,
				top: 15,
				bottom: 15
			}
		},
		plugins: {
			legend : {
				display: false,
				position: 'right',
				align: 'start',
			}
		}
	}
	
	if(reportFetched && report){
		return (
			<Frame ref={frameRef} width={'100%'} height={'100%'} initialContent={initialContent}>
				<React.Fragment>
					<h1>Tenant Lease Report</h1>
					{report.tenant && <h2>Name: {report.tenant.firstName} {report.tenant.lastName}</h2>}
					{report.tenant && <h4>Email: {report.tenant.email} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Phone: {report.tenant.phoneNumber}</h4>}
					<table>
						<tbody>
						<tr>
							<td className={'canvas'} style={pdfStyles.canvas.td}>
								<Doughnut style={pdfStyles.canvas.self} data={chartData} ref={canvasRef} type={'doughnut'}
										  options={chartOptions} plugins={[outLabels]}/>
							</td>
							<td>
								{report.labels.map((label,index)=>{
									return (
										<div key={label} style={{marginBottom:'5px'}}>
													<span style={{...pdfStyles.legend.span, backgroundColor: report.colors[index]}}>
														&nbsp;
													</span>&nbsp;{label}&nbsp;({report.percentages[index].toFixed(1)}%)
										</div>
									)
								})}
							</td>
						</tr>
						</tbody>
					</table>
					<br />
					<h3>Overall Rating: {Number(report.rating).toFixed(2)}</h3>
					<h3>Rating Scale:</h3>
					<br />
					<div style={{display:'inline-block', margin:'0 auto'}}>
						<div style={{position:'relative'}}>
							<div className={'pointer top'} style={{width: ((report.rating/5)*100)+'%'}}>
								<span className={'caret down'}/>
							</div>
						</div>
						<span className={'pill bg-danger'}>VERY POOR</span>
						<span className={'pill bg-warning'}>POOR</span>
						<span className={'pill bg-info'}>FAIR</span>
						<span className={'pill bg-success'}>GOOD</span>
						<span className={'pill bg-primary'} style={{marginRight:0}}>EXCELLENT</span>
						<div style={{position:'relative'}}>
							<div className={'pointer bottom'} style={{width: '100px', textAlign:'left'}}>
								<span className={'caret right'}/><br />0.00
							</div>
						</div>
						<div style={{position:'relative'}}>
							<div className={'pointer bottom'} style={{width: '100%'}}>
								<span className={'caret left'}/><br />5.00
							</div>
						</div>
					</div>
					<br /><br /><br /><br /><br /><br />
					<hr />
					<br />
					<h1>Leases</h1>
					{report.leases.map(lease=>{
						return(
							<React.Fragment key={lease.id}>
								<h2>{lease.property.name}</h2>
								<table style={{width:'100%',border:'1px solid #ccc', borderCollapse:'collapse'}}>
									<tbody>
									<tr>
										<td>Start Date</td><td style={{borderRight:'1px solid #ccc'}}><ShortDateString date={lease.startDate} /></td>
										<td>End Date</td><td><ShortDateString date={lease.endDate} /></td>
									</tr>
									<tr>
										<td>Rent Amount</td>
										<td style={{borderRight:'1px solid #ccc'}}>
											{lease.currency} {lease.amount.toFixed(2)} every {lease.paymentSchedule.repeatEvery===1?'':lease.paymentSchedule.repeatEvery}
											{lease.paymentSchedule.cycle.toLowerCase()} {lease.paymentSchedule.repeatEvery===1?'':'s'}
										</td>
										<td>Last Payment Date</td><td>{lease.lastInvoiceDate?<ShortDateString date={lease.lastInvoiceDate} />:'--/--/--'}</td>
									</tr>
									<tr>
										<td>Amount Paid</td>
										<td style={{borderRight:'1px solid #ccc'}}>
											{lease.currency} {Number(report.amountPaid).toFixed(2)}
										</td>
										<td>Outstanding Balance</td>
										<td>{lease.currency} {Number(report.amountDue).toFixed(2)}</td>
									</tr>
									</tbody>
								</table>
							</React.Fragment>
						)
					})}
				</React.Fragment>
			</Frame>
		)
	}
	return null
}

export default ReportFrame