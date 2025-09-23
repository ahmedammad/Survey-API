export type SurveyEntity = {
    id: string;
    propertyType: string;
    roofOrientations: string[];
    roofAge: string;
    consumption: string;
    interestedOtherSolutions: string;
    contact?: {
        name?: string;
        email?: string;
        phone?: string;
    };
    createdAt: string;
};