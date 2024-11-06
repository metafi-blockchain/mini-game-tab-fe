const dev_config = {
	BASE_URL: import.meta.env.VITE_BASE_URL,
	REF_LINK: import.meta.env.VITE_REF_LINK,
	MINI_APP_LINK: import.meta.env.VITE_TELE_LINK
};
const prod_config = {
	BASE_URL: import.meta.env.VITE_BASE_URL,
	REF_LINK: import.meta.env.VITE_REF_LINK,
	MINI_APP_LINK: import.meta.env.VITE_TELE_LINK
};

export const config =
	process.env.NODE_ENV === 'production' ? prod_config : dev_config;
