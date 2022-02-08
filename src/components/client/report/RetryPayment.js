import React, {useState} from "react";
import {useDispatch} from "react-redux";
import * as yup from "yup";
import {setInfo} from "../../../features/notifications/NotificationSlice";
import {get_axios_error} from "../../../helpers/general";
import {Form, Formik} from "formik";
import {Alert, Button, Spinner} from "react-bootstrap";
import OrderPayment from "./OrderPayment";

const RetryPayment = ({order}) => {
	
	const dispatch = useDispatch()
	const [alert, setAlert] = useState('')
	
	const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
	const schema = yup.object().shape({
		currency: yup.string().required(),
		paymentMethod: yup.string().required(),
		mobileMoneyNumber: yup.string().min(4, 'Phone number must have at least 4 digits').matches( phoneRegExp, 'Phone number is not valid' ),
		orderId: yup.string().required()
	})
	
	const initialValues = {
		currency: order.currency || 'ZWD',
		paymentMethod: order.paymentMethod || '',
		mobileMoneyNumber: order.mobileMoneyNumber || '',
		returnUrl: window.location.origin+'/orders/',
		orderId: order.id || ''
	}
	const handleSubmit = (form, FormikBag) => {
		setAlert('')
		window.axios.post('orders/payment', form)
			.then(response => {
				const order = response.data
				if(order.message) dispatch(setInfo(response.data.message))
				
				if(order.isMobile){
					setAlert(order.instructions)
				}
				else if (order.redirectUrl){
					window.location.href = order.redirectUrl
				}
			})
			.catch((error) => {
				const e = get_axios_error(error)
				setAlert(e.message)
			})
			.finally(()=>{
				FormikBag.setSubmitting(false)
			})
	}
	
	if(order) return(
		<Formik initialValues={initialValues} onSubmit={(values, FormikBag) => handleSubmit(values, FormikBag)} validationSchema={schema}>
			{({errors, values, handleChange, isSubmitting}) => (
				<Form noValidate className="g-3">
					{ alert && <Alert variant={'warning'} onClose={() => setAlert('')} dismissible>{alert}</Alert> }
					<OrderPayment errors={errors} values={values}  handleChange={handleChange} />
					<fieldset>
						{isSubmitting ? <Button variant="danger" className="px-5 float-end" disabled>
							<Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true"/> Submit
						</Button> : <Button variant={'danger'} type="submit" className="px-5 float-end"><i className="bx bx-check" /> Submit</Button> }
					</fieldset>
				</Form>
			)}
		</Formik>
	)
	else return null
}

export default RetryPayment