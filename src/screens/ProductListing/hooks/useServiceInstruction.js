import { useQuery } from '@apollo/react-hooks';
import GET_URL_SERVICE_INSTRUCTION from '@skp/screens/ProductListing/graphql/getUrlServiceInstruction.graphql';

export const useServiceInstruction = ({
    services = [],
    pillarCode,
    serviceCode = '',
    titlePillar
}) => {
    const { data: serviceInstruction } = useQuery(GET_URL_SERVICE_INSTRUCTION, {
        fetchPolicy: 'no-cache',
        variables: {
            serviceCode: serviceCode,
            pillarCode: pillarCode
        }
    });

    const url = serviceInstruction
        ? serviceInstruction.getUrlServiceInstruction.url
        : '';
    let labelServiceInstruction = '';
    if (!serviceCode) {
        labelServiceInstruction = titlePillar;
    } else {
        services.some(service => {
            if (service.value == serviceCode) {
                labelServiceInstruction = service.label;

                return true;
            }
        });
    }

    return {
        label: labelServiceInstruction,
        url
    };
};
