/*
 * Map Magento 2.3.1 schema changes to Venia 2.0.0 proptype shape
 * to maintain backwards compatibility.
 */

export default product => {
    const {
        description,
        small_image,
        short_description,
        service_name,
        remark_description,
        set_contents_description,
        sky_content_partner_benefit,
        sky_content_terms_and_conditions
    } = product;

    const newDescription =
        typeof description === 'object' ? description.html : description;
    const newSmallImage =
        typeof small_image === 'object' ? small_image.url : small_image;

    const newShortDescription =
        typeof short_description === 'object'
            ? short_description.html
            : short_description;
    const newRemarkDescription =
        typeof remark_description === 'object'
            ? remark_description.html
            : remark_description;
    const newSetContentsDescription =
        typeof set_contents_description === 'object'
            ? set_contents_description.html
            : set_contents_description;
    const newContentPartnerBenefit =
        typeof sky_content_partner_benefit === 'object'
            ? sky_content_partner_benefit.html
            : sky_content_partner_benefit;
    const newContentTermsAndConditions =
        typeof sky_content_terms_and_conditions === 'object'
            ? sky_content_terms_and_conditions.html
            : sky_content_terms_and_conditions;

    return {
        ...product,
        description: newDescription,
        small_image: newSmallImage,
        short_description: newShortDescription,
        pillar_name: product.pillar.name,
        service_name,
        remark_description: newRemarkDescription,
        set_contents_description: newSetContentsDescription,
        sky_content_partner_benefit: newContentPartnerBenefit,
        sky_content_terms_and_conditions: newContentTermsAndConditions
    };
};
