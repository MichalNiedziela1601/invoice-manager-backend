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
                return googleMethods.createFolder(auth, company.name);
            })
            .then(folderId => {
                return companyDao.addFolderId(folderId.id, company.nip)
            });
}

function createYearMonthFolder(auth, invoice,companyFolderId)
{
    return googleMethods.createChildFolder(auth, new Date(invoice.createDate).getFullYear(),companyFolderId)
            .then(yearId =>
            {
                invoice.googleYearFolderId = yearId.id;
                return googleMethods.createChildFolder(auth, monthNames[new Date(invoice.createDate).getMonth()],yearId.id)
            }).then(monthId =>
            {
                invoice.googleMonthFolderId = monthId.id;
                return invoice;
            })
}

module.exports = {
    createFolderCompany,createYearMonthFolder
};
