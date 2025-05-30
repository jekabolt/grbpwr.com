export const errorMessages = {
    firstName: {
        min: 'first name must contain at least 1 character',
        max: 'first name must contain at most 40 characters',
        regex: {
            restriction: /^(?!.*  )[\p{L} .'-]+$/u,
            message: 'only latin letters, spaces, hyphens, apostrophes, and periods are allowed; no consecutive spaces',
        }
    },
    lastName: {
        min: 'last name must contain at least 1 character',
        max: 'last name must contain at most 40 characters',
        regex: {
            restriction: /^(?!.*  )[\p{L} .'-]+$/u,
            message: 'only latin letters, spaces, hyphens, apostrophes, and periods are allowed; no consecutive spaces',
        }
    },
    phone: {
        min: 'phone must contain at least 5 numbers',
        max: 'phone must contain at most 15 numbers'
    },
    city: {
        min: 'city must contain at least 2 characters',
        regex: {
            restriction: /^(?!.*  )[\p{L} .'-]+$/u,
            message: 'only latin letters, spaces, hyphens, apostrophes, and periods are allowed; no consecutive spaces',
        }
    },
    address: {
        min: 'address must contain at least 10 characters',
        max: 'address must contain at most 40 characters',
        regex: {
            restriction: /^(?!.*  )[\p{L}0-9 .'-]+$/u,
            message: 'only letters, numbers, spaces, hyphens, apostrophes, and periods are allowed; no consecutive spaces',
        }
    },
    postalCode: {
        min: 'postal code must contain at least 2 characters',
        max: 'postal code must contain at most 12 characters',
        regex: {
            restriction: /^(?!.*  )[A-Za-z0-9 \- ]{2,12}$/,
            message: 'postal code must contain only letters, numbers, spaces, or hyphens; no consecutive spaces'
        }
    },
    country: {
        min: 'country must contain at least 2 characters'
    },
    company: {
        min: 'company must contain at least 1 character',
        max: 'company must contain at most 40 characters',
        regex: {
            restriction: /^(?!.*  )[\p{L}0-9 .'-]+$/u,
            message: 'only letters, numbers, spaces, hyphens, apostrophes, and periods are allowed; no consecutive spaces',
        }
    },
    email: {
        invalid: 'invalid email',
        max: 'email must contain at most 40 characters'
    }
};
