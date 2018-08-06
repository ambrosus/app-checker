if (typeof window.web3 !== "undefined" && typeof window.web3.currentProvider !== "undefined") {
    var web3 = new Web3(window.web3.currentProvider);
} else {
    web3 = new Web3();
}

const ambrosus = new AmbrosusSDK({
    apiEndpoint: 'https://gateway-test.ambrosus.com'
});

onInit();

function onInit() {
    const eventId = window.location.href.split('=')[1];
    console.log(eventId);
    if (eventId === undefined) {
        console.log('Undefined');
    } else {
        getEventById(eventId);
    }
    document.getElementById('firstPage').style.display = 'block';
    document.getElementById('secondPage').style.display = 'none';
    document.getElementById('invalid').style.display = 'none';
}

window.onpopstate = function () {
    onInit();
}

function check() {
    getEventById(document.getElementById('eventId').value);
}

function getEventById(eventId) {
    ambrosus.getEventById(eventId)
        .then(response => initVerify(response.data))
        .catch(error => throwError());
}

function throwError() {
    document.getElementById('invalid').style.display = 'block';
}

function initVerify(eventData) {
    window.history.pushState( {} , '', '?eventId=' + eventData.eventId );
    document.getElementById('firstPage').style.display = 'none';
    document.getElementById('secondPage').style.display = 'block';
    document.getElementById("eventResponse").innerHTML = JSON.stringify(eventData, null, "  ");
    const idData = eventData.content.idData;
    const signature = eventData.content.signature;
    const data = eventData.content.data;
    const eventId = eventData.eventId;
    verify(idData, signature, data, eventId);
}

function verify(ambIdData, ambSignature, ambData, ambEventId) {

    // Check Data Hash
    const web3DataHash = calculateHash(ambData);
    if (ambIdData.dataHash === web3DataHash) {
        console.log('Data Hash verified');
        document.getElementById('dataHashTrue').style.display = '-webkit-inline-box';
        document.getElementById("ambDataHash").innerHTML = ambIdData.dataHash;
        document.getElementById("web3DataHash").innerHTML = web3DataHash;
    }

    // Check createdBy (public Key)
    const web3CreatedBy = web3.eth.accounts.recover(serializeForHashing(ambIdData), ambSignature);
    if (ambIdData.createdBy === web3CreatedBy) {
        console.log('Signature verified');
        document.getElementById('createdByTrue').style.display = 'block';
        document.getElementById("ambCreatedBy").innerHTML = ambIdData.createdBy;
        document.getElementById("web3CreatedBy").innerHTML = web3CreatedBy;
    }

    // Insert the signature in content
    const content = {
        content: {
            idData: ambIdData,
            data: ambData,
            signature: ambSignature
        }
    }

    // Get the keccak256 hash of content to get the eventId
    const web3EventId = calculateHash(content.content);
    if (ambEventId === web3EventId) {
        console.log('EventID verified');
        document.getElementById('eventIdTrue').style.display = 'block';
        document.getElementById("ambEventId").innerHTML = ambEventId;
        document.getElementById("web3EventId").innerHTML = web3EventId;
    }
}

function serializeForHashing(object) {
    const isDict = (subject) => typeof subject === 'object' && !Array.isArray(subject);
    const isString = (subject) => typeof subject === 'string';
    const isArray = (subject) => Array.isArray(subject);

    if (isDict(object)) {
        const content = Object
            .keys(object)
            .sort()
            .map((key) => `"${key}":${serializeForHashing(object[key])}`)
            .join(',');
        return `{${content}}`;
    } else if (isArray(object)) {
        const content = object.map((item) => serializeForHashing(item)).join(',');
        return `[${content}]`;
    } else if (isString(object)) {
        return `"${object}"`;
    }
    return object.toString();
}

function calculateHash(data) {
    const serialized = this.serializeForHashing(data);
    return this.web3.eth.accounts.hashMessage(serialized);
}