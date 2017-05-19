const companyDao = require('../dao/company.dao');
const googleMethods = require('./google.methods');
const personDao = require('../dao/person.dao');
const appException = require('../services/applicationException');

function createFolderCompany(auth, id)
{
    let company = null;
    let folder = null;
    return companyDao.getCompanyById(id)
            .then(result =>
            {
                company = result;
                return googleMethods.checkFolderExists(auth, company.googleCompanyId).then(folderId =>
                {
                    return folderId;
                }, () =>
                {
                    return googleMethods.createFolder(auth, company.shortcut);
                })
            })
            .then(folderId =>
            {
                folder = folderId;
                return companyDao.addFolderId(folderId, company.nip);
            })
            .then(() =>
            {
                return {company: company, folderId: folder};
            })
            .catch(function (error)
            {
                throw appException.new(appException.ERROR, 'Something bad with createFolderCompany: ' + error);
            });
}
function createFolderPerson(auth, id)
{
    let person = null;
    return personDao.getPersonById(id)
            .then(result =>
            {
                person = result;
                return googleMethods.checkFolderExists(auth, person.googlePersonId).then(folderId =>
                {
                    return folderId;
                }, () =>
                {
                    return googleMethods.createFolder(auth, person.firstName + ' ' + person.lastName);
                })
            })
            .then(folderId =>
            {
                return personDao.addFolderId(folderId, person.id)
            })
            .catch(function (error)
            {
                throw appException.new(appException.ERROR, 'Something bad with createFolderPerson: ' + error);
            });
}

function createYearMonthFolder(auth, invoice, companyFolderId)
{
    let name = new Date(invoice.createDate).getFullYear() + '-' + companyFolderId.company.shortcut;
    return googleMethods.findFolderByName(auth, name, companyFolderId.folderId)
            .then(res =>
            {
                if (res.files.length > 0) {
                    return res.files[0].id;
                }
                return googleMethods.createChildFolder(auth, name, companyFolderId.folderId)
            })
            .then(yearId =>
            {
                invoice.googleYearFolderId = yearId;
                let date = new Date(invoice.createDate).toISOString().replace(/T/, ' ')
                        .replace(/\..+/, '')
                        .match(/(\d{4}-\d{2})/);
                name = date[1] + '-' + companyFolderId.company.shortcut;
                return googleMethods.findFolderByName(auth, name, yearId).then(res =>
                {
                    if (res.files.length > 0) {
                        return res.files[0].id;
                    }
                    return googleMethods.createChildFolder(auth, name, yearId);
                })
            })
            .then(monthId =>
            {
                invoice.googleMonthFolderId = monthId;
                return invoice;
            })
            .catch(function (error)
            {
                throw appException.new(appException.ERROR, 'Something bad with createYearMonthFolder: ' + error);
            });
}

module.exports = {
    createFolderCompany, createYearMonthFolder, createFolderPerson
};
