import { companyInfo } from "@/app/lib/company";

const OurAddressSign = () => {
    return (
        <p>
            {companyInfo.legalName}
            <br />
            Email:{" "}
            <a href={`mailto:${companyInfo.email}`} className="text-blue-400 underline">
                {companyInfo.email}
            </a>
            <br />
            Website:{" "}
            <a href={companyInfo.websiteUrl} className="text-blue-400 underline">
                {companyInfo.website}
            </a>
            <br />
            CIN: {companyInfo.cin}
            <br />
            Registered Office: {companyInfo.registeredOffice}
        </p>
    );
};

export default OurAddressSign;
