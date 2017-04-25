const companyDao = require('../dao/company.dao');
const googleMethods = require('./google.methods');

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'
];
function createFolderCompany(auth, id)
{
    let company = null;
    return companyDao.getCompanyById(id)
            .then(result =>
            {
                company = result;
                return googleMethods.checkFolderExists(auth, company.googleCompanyId).then(folderId =>
                {
                    return folderId;
                }, () =>
                {
                    return googleMethods.createFolder(auth, company.name);
                })
            })
            .then(folderId =>
            {
                return companyDao.addFolderId(folderId, company.nip)
            });
}

function createYearMonthFolder(auth, invoice, companyFolderId)
{
    return googleMethods.findFolderByName(auth, new Date(invoice.createDate).getFullYear(), companyFolderId).then(res =>
    {
        if (res.files.length > 0) {
            return res.files[0].id;
        }
        return googleMethods.createChildFolder(auth, new Date(invoice.createDate).getFullYear(), companyFolderId)
    })

            .then(yearId =>
            {
                invoice.googleYearFolderId = yearId;
                return googleMethods.findFolderByName(auth, monthNames[new Date(invoice.createDate).getMonth()], yearId).then(res =>
                {
                    if (res.files.length > 0) {
                        return res.files[0].id;
                    }
                    return googleMethods.createChildFolder(auth, monthNames[new Date(invoice.createDate).getMonth()], yearId);
                })
            })
            .then(monthId =>
            {
                invoice.googleMonthFolderId = monthId;
                return invoice;
            })
}

module.exports = {
    createFolderCompany, createYearMonthFolder
};
