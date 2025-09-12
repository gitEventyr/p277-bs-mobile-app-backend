export declare class CasinoOfferDto {
    logo_url: string;
    id: number;
    public_name: string;
    offer_preheading: string;
    offer_heading: string;
    offer_subheading: string;
    terms_and_conditions: string;
    offer_link: string;
    is_active: boolean;
    button_label: string;
}
export declare class CasinoOffersResponseDto {
    offers: CasinoOfferDto[];
}
