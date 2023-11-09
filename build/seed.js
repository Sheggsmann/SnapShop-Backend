"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker");
const product_service_1 = require("./shared/services/db/product.service");
const store_service_1 = require("./shared/services/db/store.service");
const setupDb_1 = __importDefault(require("./setupDb"));
(0, setupDb_1.default)();
async function seedStoreData(locations, userIds) {
    for (const location of locations) {
        const userId = userIds[Math.floor(Math.random() * userIds.length)];
        const storeData = {
            name: faker_1.faker.company.name(),
            description: faker_1.faker.company.catchPhrase(),
            owner: userId,
            uId: faker_1.faker.number.int(),
            badges: [],
            verified: false,
            locations: [
                {
                    location: { type: 'Point', coordinates: [location.coords[1], location.coords[0]] },
                    address: location.address
                }
            ]
        };
        store_service_1.storeService.addStoreToDB(userId, storeData);
        console.log('\n***** ADDING STORE TO DB *****', storeData);
    }
}
async function seedProductData(productCount, storeIds) {
    for (let i = 0; i < productCount; i++) {
        const storeId = storeIds[Math.floor(Math.random() * storeIds.length)];
        const productData = {
            name: faker_1.faker.commerce.productName(),
            description: faker_1.faker.commerce.productDescription(),
            price: faker_1.faker.commerce.price(),
            category: faker_1.faker.commerce.productAdjective(),
            store: storeId,
            images: [
                {
                    url: 'https://media.istockphoto.com/id/1405321051/photo/checkmark-and-voting-satisfaction-concept-hand-finger-on-smartphone-screen-with-confirm.webp?b=1&s=612x612&w=0&k=20&c=RcLGwwiDu-qMEW3e2xRB0Jxd_MtcAUrhE2bLASW1238=',
                    public_id: 'woe3'
                }
            ],
            videos: [{ url: 'https://youtu.be/953vyZMO4cM', public_id: 'product_videos/oro4mi4' }],
            quantity: faker_1.faker.number.binary(),
            purchaseCount: Math.floor(faker_1.faker.number.int() / 100000000000000)
        };
        await product_service_1.productService.addProductToDB(productData, storeId);
        console.log('\n**** ADDING PRODUCT TO DB ****', productData);
    }
}
// seedStoreData(
//   [
//     { coords: [7.325626678833696, 3.8755283644865806], address: 'Toll Gate Mini Depot' },
//     { coords: [7.327425381022358, 3.86861930702444], address: 'Bentos Pharmaceuticals' },
//     { coords: [7.345860300114969, 3.878279982712926], address: 'Challenge Motor Park' },
//     { coords: [7.33761513823978, 3.883443251731057], address: 'Dream Wise Hotel and Suites' },
//     { coords: [7.361062333036288, 3.771908210363376], address: 'Latorie Imperial Kiddies Academy' }
//   ],
//   ['654c64f148c19b8162148324', '654c3f9a99ecc3f006545b84', '654c654948c19b8162148326']
// );
// seedProductData(15, [
//   '654c6af92e9bd0bf0baefb2a',
//   '654c6af92e9bd0bf0baefb28',
//   '654c6af92e9bd0bf0baefb22',
//   '654c6af92e9bd0bf0baefb26',
//   '654c6af92e9bd0bf0baefb24',
//   '654c401199ecc3f006545b85',
//   '652d39aaef651c827ab5bb01'
// ]);
