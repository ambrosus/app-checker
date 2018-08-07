![alt text](https://cdn-images-1.medium.com/max/1600/1*hGJHnXJuOmfjIcEofbC0Ww.png 'Ambrosus')

# app-checker
Client side checker application to verify AMB events data using web3.js library

## Overview
Ambrosus app-checker helps you validate the `events` on the Ambrosus Network. 
The validations are achieved on the client web browser using the web3.js library 

## Example of an Event Response

```json 

[
   {
      "content": {
         "idData": {
            "assetId": "0xf86f90bd658554d1e413c769c7dea0eca701ae87f79bf26e3b292b070cfceefd",
            "timestamp": 1533210439,
            "accessLevel": 0,
            "createdBy": "0x9687a70513047dc6Ee966D69bD0C07FFb1102098",
            "dataHash": "0xa0a1faba2255d26751e3f0c67a895204ab81846a27f8e61e8645fc9eaf622f25"
         },
         "data": [
            {
               "type": "ambrosus.asset.manufactured",
               "name": "Chocolate Manufactured",
               "documents": {
                  "default": "https://image.ibb.co/mUrgvH/HO.jpg"
               },
               "Harvest Information": {
                  "Total volume": "80 grams",
                  "Harvest Date": "03.01.2019",
                  "Brand": "Codefa"
               },
               "group1": {
                  "cap type": "spray cap",
                  "model": "Brumes de Saveurs"
               }
            }
         ],
         "signature": "0xee711c9fbf2ffa597a44407e44d1d576e165d37294cdbba0f29fa765b3c1a8883c094664bfc0c3a2950785fc7d88643e6d65923e2b1e1ed0b4c85587f4ffa8951b"
      },
      "eventId": "0xafabaf37776fcf55040285b8bf2d38db6795afeaf19815ec93fa5b852fd33947",
      "metadata": {
         "bundleId": "0xb244cdc564eebe6dd2e0e4063b9f040093842599ad74b0a3e9108859cc286893",
         "entityUploadTimestamp": 1533210440
      }
   }
]

```

Based on the above JSON response, the app-checker validates if each field is original & authentic by simulating the same operations conducted at the time of event creation. 

## Checks Covered

> **Created By**

This check is performed to certify that a public key actually belongs to a company or a person. This is achieved by connecting node ethereum address with physical place on the internet where all the events and assets data are actually stored.

> **Data Hash**

Based on the JSON example provided above, Data Hash is the hash of serialized `content.data`. This dataHash is then inserted into `content.idData` (Identity data). 

> **Signature**

A signature is the serialized idData `signed` with the creator's `private key`. Signature is verified by recovering the public key (createdBy address) using the signature and idData

> **Event ID**

The eventId is calculated by the output of keccak256 hash of serialized `content`. Similarly, the web3.js library on the client side calculates the keccak256 hash of the `content`. This `content` data is prepared on the client machine by the steps demonstrated up until now. Only the final calculated values are compared to the JSON response from AMB-NET and verified. 

> **Bundle ID**

This check is important to see if the eventId exists in the BundleID provided by the AMB-NET response. Each event on the network is associated with a bundleId. 


## Get started
Clone the repository and open `index.html` in the browser

Enter an `eventId` to verify

## Routing

In order to access the event checks, the eventId can be passed in the URL. 

Example: `https://ambrosus.github.io/app-checker?eventId=0x1dd17367bfa2b414846692385f05388f840ad546514fba57511ff1d6ca5acdd2`

Here in, the eventId is passed as a query parameter.
