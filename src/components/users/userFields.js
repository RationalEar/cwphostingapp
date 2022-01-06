import * as yup from "yup"

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
export const schema = yup.object().shape({
	firstName: yup.string().required().min(2, 'A name should have at least 2 characters'),
	lastName: yup.string().required().min(2, 'A name should have at least 2 characters'),
	email: yup.string().email().required(),
	phoneNumber: yup.string().min(4, 'Phone number must have at least 4 digits').matches( phoneRegExp, 'Phone number is not valid' ),
	address: yup.object().shape({
		addressLine1: yup.string(),
		addressLine2: yup.string(),
		city: yup.string(),
		country: yup.string(),
		postCode: yup.string()
	}),
	roles: yup.array().of(
		yup.object().shape({
			id: yup.string().nullable(),
			name: yup.string(),
			alias: yup.string().nullable()
		})
	)
})

export const roleSchema = yup.object().shape({
	name: yup.string().required().min(2, 'A name should have at least 2 characters'),
	alias: yup.string().required().min(2, 'A name should have at least 2 characters')
})