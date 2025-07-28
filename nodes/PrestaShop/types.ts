export interface Filter {
	field?: string;
	value?: string;
	condition_type?: string;
}

export interface SortOrder {
	field?: string;
	direction?: string;
}

export interface Translation {
	idLang: string;
	valueLang: string;
}