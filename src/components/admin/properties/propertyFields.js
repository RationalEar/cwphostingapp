import * as yup from "yup"

export const schema = yup.object().shape({
	name: yup.string().required().min(2, 'A name should have at least 2 characters'),
	description: yup.string(),
	ownerId: yup.string().required(),
	status: yup.string().required(),
	address: yup.object().shape({
		addressLine1: yup.string(),
		addressLine2: yup.string(),
		city: yup.string(),
		country: yup.string(),
		postCode: yup.string()
	})
})