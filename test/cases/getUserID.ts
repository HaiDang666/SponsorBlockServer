import fetch from 'node-fetch';
import {Done, getbaseURL} from '../utils';
import {db} from '../../src/databases/databases';
import {getHash} from '../../src/utils/getHash';
import assert from 'assert';

describe('getUserID', () => {
    before(async () => {
        const insertUserNameQuery = 'INSERT INTO "userNames" ("userID", "userName") VALUES(?, ?)';
        await db.prepare("run", insertUserNameQuery, [getHash("getuserid_user_01"), 'fuzzy user 01']);
        await db.prepare("run", insertUserNameQuery, [getHash("getuserid_user_02"), 'fuzzy user 02']);
        await db.prepare("run", insertUserNameQuery, [getHash("getuserid_user_03"), 'specific user 03']);
        await db.prepare("run", insertUserNameQuery, [getHash("getuserid_user_04"), 'repeating']);
        await db.prepare("run", insertUserNameQuery, [getHash("getuserid_user_05"), 'repeating']);
        await db.prepare("run", insertUserNameQuery, [getHash("getuserid_user_06"), getHash("getuserid_user_06")]);
        await db.prepare("run", insertUserNameQuery, [getHash("getuserid_user_07"), '0redos0']);
        await db.prepare("run", insertUserNameQuery, [getHash("getuserid_user_08"), '%redos%']);
        await db.prepare("run", insertUserNameQuery, [getHash("getuserid_user_09"), '_redos_']);
        await db.prepare("run", insertUserNameQuery, [getHash("getuserid_user_10"), 'redos\\%']);
        await db.prepare("run", insertUserNameQuery, [getHash("getuserid_user_11"), '\\\\\\']);
        await db.prepare("run", insertUserNameQuery, [getHash("getuserid_user_12"), 'a']);
    });

    it('Should be able to get a 200', (done: Done) => {
        fetch(getbaseURL() + '/api/userID?username=fuzzy+user+01')
        .then(async res => {
            if (res.status !== 200) done('non 200 (' + res.status + ')');
            else done(); // pass
        })
        .catch(() => done('couldn\'t call endpoint'));
    });

    it('Should be able to get a 400 (No username parameter)', (done: Done) => {
        fetch(getbaseURL() + '/api/userID')
        .then(res => {
            if (res.status !== 400) done('non 400 (' + res.status + ')');
            else done(); // pass
        })
        .catch(() => done('couldn\'t call endpoint'));
    });

    it('Should be able to get a 200 (username is public id)', (done: Done) => {
        fetch(getbaseURL() + '/api/userID?username='+getHash("getuserid_user_06"))
        .then(async res => {
            if (res.status !== 200) done('non 200 (' + res.status + ')');
            else done(); // pass
        })
        .catch(() => done('couldn\'t call endpoint'));
    });

    it('Should be able to get a 400 (username longer than 64 chars)', (done: Done) => {
        fetch(getbaseURL() + '/api/userID?username='+getHash("getuserid_user_06")+'0')
        .then(res => {
            if (res.status !== 400) done('non 400 (' + res.status + ')');
            else done(); // pass
        })
        .catch(() => done('couldn\'t call endpoint'));
    });

    it('Should be able to get single username', (done: Done) => {
        fetch(getbaseURL() + '/api/userID?username=fuzzy+user+01')
        .then(async res => {
            if (res.status !== 200) {
                done("non 200");
            } else {
                const data = await res.json();
                if (data.length !== 1) {
                    done('Returned incorrect number of users "' + data.length + '"');
                } else if (data[0].userName !== "fuzzy user 01") {
                    done('Returned incorrect username "' + data.userName + '"');
                } else if (data[0].userID !== getHash("getuserid_user_01")) {
                    done('Returned incorrect userID "' + data.userID + '"');
                } else {
                    done(); // pass
                }
            }
        })
        .catch(() => ("couldn't call endpoint"));
    });

    it('Should be able to get multiple fuzzy user info from start', (done: Done) => {
        fetch(getbaseURL() + '/api/userID?username=fuzzy+user')
        .then(async res => {
            if (res.status !== 200) {
                done("non 200");
            } else {
                const data = await res.json();
                if (data.length !== 2) {
                    done('Returned incorrect number of users "' + data.length + '"');
                } else if (data[0].userName !== "fuzzy user 01") {
                    done('Returned incorrect username "' + data.userName + '"');
                } else if (data[0].userID !== getHash("getuserid_user_01")) {
                    done('Returned incorrect userID "' + data.userID + '"');
                } else if (data[1].userName !== "fuzzy user 02") {
                    done('Returned incorrect username "' + data.userName + '"');
                } else if (data[1].userID !== getHash("getuserid_user_02")) {
                    done('Returned incorrect userID "' + data.userID + '"');
                } else {
                    done(); // pass
                }
            }
        })
        .catch(() => ("couldn't call endpoint"));
    });

    it('Should be able to get multiple fuzzy user info from middle', (done: Done) => {
        fetch(getbaseURL() + '/api/userID?username=user')
        .then(async res => {
            if (res.status !== 200) {
                done("non 200");
            } else {
                const data = await res.json();
                if (data.length !== 3) {
                    done('Returned incorrect number of users "' + data.length + '"');
                } else if (data[0].userName !== "fuzzy user 01") {
                    done('Returned incorrect username "' + data.userName + '"');
                } else if (data[0].userID !== getHash("getuserid_user_01")) {
                    done('Returned incorrect userID "' + data.userID + '"');
                } else if (data[1].userName !== "fuzzy user 02") {
                    done('Returned incorrect username "' + data.userName + '"');
                } else if (data[1].userID !== getHash("getuserid_user_02")) {
                    done('Returned incorrect userID "' + data.userID + '"');
                } else if (data[2].userName !== "specific user 03") {
                    done('Returned incorrect username "' + data.userName + '"');
                } else if (data[2].userID !== getHash("getuserid_user_03")) {
                    done('Returned incorrect userID "' + data.userID + '"');
                } else {
                    done(); // pass
                }
            }
        })
        .catch(() => ("couldn't call endpoint"));
    });

    it('Should be able to get with public ID', (done: Done) => {
        const userID = getHash("getuserid_user_06");
        fetch(getbaseURL() + '/api/userID?username='+userID)
        .then(async res => {
            if (res.status !== 200) {
                done("non 200");
            } else {
                const data = await res.json();
                if (data.length !== 1) {
                    done('Returned incorrect number of users "' + data.length + '"');
                } else if (data[0].userName !== userID) {
                    done('Returned incorrect username "' + data.userName + '"');
                } else if (data[0].userID !== userID) {
                    done('Returned incorrect userID "' + data.userID + '"');
                } else {
                    done(); // pass
                }
            }
        })
        .catch(() => ("couldn't call endpoint"));
    });

    it('Should be able to get with fuzzy public ID', (done: Done) => {
        const userID = getHash("getuserid_user_06");
        fetch(getbaseURL() + '/api/userID?username='+userID.substr(10,60))
        .then(async res => {
            if (res.status !== 200) {
                done("non 200");
            } else {
                const data = await res.json();
                if (data.length !== 1) {
                    done('Returned incorrect number of users "' + data.length + '"');
                } else if (data[0].userName !== userID) {
                    done('Returned incorrect username "' + data.userName + '"');
                } else if (data[0].userID !== userID) {
                    done('Returned incorrect userID "' + data.userID + '"');
                } else {
                    done(); // pass
                }
            }
        })
        .catch(() => ("couldn't call endpoint"));
    });

    it('Should be able to get repeating username', (done: Done) => {
        fetch(getbaseURL() + '/api/userID?username=repeating')
        .then(async res => {
            if (res.status !== 200) {
                done("non 200");
            } else {
                const data = await res.json();
                if (data.length !== 2) {
                    done('Returned incorrect number of users "' + data.length + '"');
                } else if (data[0].userName !== "repeating") {
                    done('Returned incorrect username "' + data.userName + '"');
                } else if (data[0].userID !== getHash("getuserid_user_04")) {
                    done('Returned incorrect userID "' + data.userID + '"');
                } else if (data[1].userName !== "repeating") {
                    done('Returned incorrect username "' + data.userName + '"');
                } else if (data[1].userID !== getHash("getuserid_user_05")) {
                    done('Returned incorrect userID "' + data.userID + '"');
                } else {
                    done(); // pass
                }
            }
        })
        .catch(() => ("couldn't call endpoint"));
    });

    it('Should be able to get repeating fuzzy username', (done: Done) => {
        fetch(getbaseURL() + '/api/userID?username=peat')
        .then(async res => {
            if (res.status !== 200) {
                done("non 200");
            } else {
                const data = await res.json();
                if (data.length !== 2) {
                    done('Returned incorrect number of users "' + data.length + '"');
                } else if (data[0].userName !== "repeating") {
                    done('Returned incorrect username "' + data.userName + '"');
                } else if (data[0].userID !== getHash("getuserid_user_04")) {
                    done('Returned incorrect userID "' + data.userID + '"');
                } else if (data[1].userName !== "repeating") {
                    done('Returned incorrect username "' + data.userName + '"');
                } else if (data[1].userID !== getHash("getuserid_user_05")) {
                    done('Returned incorrect userID "' + data.userID + '"');
                } else {
                    done(); // pass
                }
            }
        })
        .catch(() => ("couldn't call endpoint"));
    });

    it('should avoid ReDOS with _', (done: Done) => {
        fetch(getbaseURL() + '/api/userID?username=_redos_')
        .then(async res => {
            if (res.status !== 200) {
                done("non 200");
            } else {
                const data = await res.json();
                if (data.length !== 1) {
                    done('Returned incorrect number of users "' + data.length + '"');
                } else if (data[0].userName !== "_redos_") {
                    done('Returned incorrect username "' + data.userName + '"');
                } else if (data[0].userID !== getHash("getuserid_user_09")) {
                    done('Returned incorrect userID "' + data.userID + '"');
                } else {
                    done(); // pass
                }
            }
        })
        .catch(() => ("couldn't call endpoint"));
    });

    it('should avoid ReDOS with %', (done: Done) => {
        fetch(getbaseURL() + '/api/userID?username=%redos%')
        .then(async res => {
            if (res.status !== 200) {
                done("non 200");
            } else {
                const data = await res.json();
                if (data.length !== 1) {
                    done('Returned incorrect number of users "' + data.length + '"');
                } else if (data[0].userName !== "%redos%") {
                    done('Returned incorrect username "' + data.userName + '"');
                } else if (data[0].userID !== getHash("getuserid_user_08")) {
                    done('Returned incorrect userID "' + data.userID + '"');
                } else {
                    done(); // pass
                }
            }
        })
        .catch(() => ("couldn't call endpoint"));
    });

    it('should return 404 if escaped backslashes present', (done: Done) => {
        fetch(getbaseURL() + '/api/userID?username=%redos\\\\_')
        .then(res => {
            if (res.status !== 404) done('non 404 (' + res.status + ')');
            else done(); // pass
        })
        .catch(() => ("couldn't call endpoint"));
    });

    it('should return 404 if backslashes present', (done: Done) => {
        fetch(getbaseURL() + '/api/userID?username=\\%redos\\_')
        .then(res => {
            if (res.status !== 404) done('non 404 (' + res.status + ')');
            else done(); // pass
        })
        .catch(() => ("couldn't call endpoint"));
    });

    it('should return user if just backslashes', (done: Done) => {
        fetch(getbaseURL() + '/api/userID?username=\\\\\\')
        .then(async res => {
            if (res.status !== 200) {
                done("non 200");
            } else {
                const data = await res.json();
                if (data.length !== 1) {
                    done('Returned incorrect number of users "' + data.length + '"');
                } else if (data[0].userName !== "\\\\\\") {
                    done('Returned incorrect username "' + data.userName + '"');
                } else if (data[0].userID !== getHash("getuserid_user_11")) {
                    done('Returned incorrect userID "' + data.userID + '"');
                } else {
                    done(); // pass
                }
            }
        })
        .catch(() => ("couldn't call endpoint"));
    });

    it('should not allow usernames more than 64 characters', (done: Done) => {
        fetch(getbaseURL() + '/api/userID?username='+'0'.repeat(65))
        .then(res => {
            if (res.status !== 400) done('non 400 (' + res.status + ')');
            else done(); // pass
        })
        .catch(() => ("couldn't call endpoint"));
    });

    it('should not allow usernames less than 3 characters', (done: Done) => {
        fetch(getbaseURL() + '/api/userID?username=aa')
        .then(res => {
            if (res.status !== 400) done('non 400 (' + res.status + ')');
            else done(); // pass
        })
        .catch(() => ("couldn't call endpoint"));
    });

    it('should allow exact match', (done: Done) => {
        fetch(getbaseURL() + '/api/userID?username=a&exact=true')
        .then(async res => {
            if (res.status !== 200) {
                done("non 200");
            } else {
                const data = await res.json();
                if (data.length !== 1) {
                    done('Returned incorrect number of users "' + data.length + '"');
                } else if (data[0].userName !== "a") {
                    done('Returned incorrect username "' + data.userName + '"');
                } else if (data[0].userID !== getHash("getuserid_user_12")) {
                    done('Returned incorrect userID "' + data.userID + '"');
                } else {
                    done(); // pass
                }
            }
        })
        .catch(() => ("couldn't call endpoint"));
    });

    it('Should be able to get repeating username with exact username', (done: Done) => {
        fetch(getbaseURL() + '/api/userID?username=repeating&exact=true')
        .then(async res => {
            if (res.status !== 200) {
                done("non 200");
            } else {
                const data = await res.json();
                if (data.length !== 2) {
                    done('Returned incorrect number of users "' + data.length + '"');
                } else if (data[0].userName !== "repeating") {
                    done('Returned incorrect username "' + data.userName + '"');
                } else if (data[0].userID !== getHash("getuserid_user_04")) {
                    done('Returned incorrect userID "' + data.userID + '"');
                } else if (data[1].userName !== "repeating") {
                    done('Returned incorrect username "' + data.userName + '"');
                } else if (data[1].userID !== getHash("getuserid_user_05")) {
                    done('Returned incorrect userID "' + data.userID + '"');
                } else {
                    done(); // pass
                }
            }
        })
        .catch(() => ("couldn't call endpoint"));
    });

    it('Should not get exact unless explicitly set to true', (done: Done) => {
        fetch(getbaseURL() + '/api/userID?username=user&exact=1')
        .then(async res => {
            if (res.status !== 200) {
                done("non 200");
            } else {
                const data = await res.json();
                if (data.length !== 3) {
                    done('Returned incorrect number of users "' + data.length + '"');
                } else if (data[0].userName !== "fuzzy user 01") {
                    done('Returned incorrect username "' + data.userName + '"');
                } else if (data[0].userID !== getHash("getuserid_user_01")) {
                    done('Returned incorrect userID "' + data.userID + '"');
                } else if (data[1].userName !== "fuzzy user 02") {
                    done('Returned incorrect username "' + data.userName + '"');
                } else if (data[1].userID !== getHash("getuserid_user_02")) {
                    done('Returned incorrect userID "' + data.userID + '"');
                } else if (data[2].userName !== "specific user 03") {
                    done('Returned incorrect username "' + data.userName + '"');
                } else if (data[2].userID !== getHash("getuserid_user_03")) {
                    done('Returned incorrect userID "' + data.userID + '"');
                } else {
                    done(); // pass
                }
            }
        })
        .catch(() => ("couldn't call endpoint"));
    });

    it('should return 400 if no username parameter specified', (done: Done) => {
        fetch(getbaseURL() + '/api/userID')
        .then(res => {
            assert.strictEqual(res.status, 400);
            done();
        })
        .catch(() => ("couldn't call endpoint"));
    });
});
