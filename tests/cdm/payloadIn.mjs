import { faker } from '@faker-js/faker';


function generateCodeNameString(stringText) {
    const randomPosition = faker.number.int({ min: 0, max: 2 });
    let prefix = '';
    let suffix = '';
    if (randomPosition === 0) {
        suffix = faker.string.alphanumeric(2);
    } else if (randomPosition === 1) {
        prefix = faker.string.alphanumeric(faker.number.int({ min: 0, max: 3 }));
        suffix = faker.string.alphanumeric(faker.number.int({ min: 0, max: 3 }));
    } else {
        prefix = faker.string.alphanumeric(2);
    }
    const generatedString = prefix + stringText + suffix;
    return generatedString.trim();
}

export function ploadGen() {
    const pload = {
        "payload": {
            "product": {
                "itemCode": 948314,
                "availabilityStatus": "A",
                "activeStatus": false,
                "productType": "O",
                "schedule": "M",
                "itemType": "PENCIL",
                "packageType": "Pencil",
                "packSize": "1.4",
                "packSizeUnit": "gm",
                "dosage": "0",
                "dosageUnit": "",
                "cartMinQty": 12,
                "cartMaxQty": 5,
                "searchKeys": "Eyebrow Enhancer",
                "inventoryLookup": "Y",
                "refundStatus": "Y",
                "coldStorage": "N",
                "dpcoStatus": "N",
                "foodLabel": "N",
                "eanCode": "8903487044432",
                "boxQty": 0,
                "unitSaleFlag": "N",
                "onlineSaleStatus": "Both",
                "unitCount": 1,
                "procuredBy": "Beauty",
                "popularity": 0,
                "brandOrGeneric": "B",
                "refillStatus": " ",
                "createdDate": "5/25/2021 11:32:32 AM",
                "modifiedDate": "2/10/2023 9:06:05 AM",
                "createdBy": "raashi",
                "modifiedBy": "Ushasurajmani",
                "requestBy": "Brand",
                "isAllowPayment": "Y",
                "catalogVisibility": true,
                "searchVisibility": true,
                "releaseTypeName": "",
                "fssaiNo": "0",
                "otxFlag": false,
                "isVegItem": " ",
                "boxPackQty": 0,
                "cartonQty": 0,
                "intakeShelfLife": "540",
                "outwardShelfLife": "240",
                "vendorNonReturnable": " ",
                "sapCode": "492492792",
                "inventoryMaxQty": 0,
                "inventoryMinQty": 0,
                "shortExpiry": 0,
                "dlFlag": "true rock 12",
                "truuthFlag": "true numb 45",
                "recommQty": 15,
                "itemShelfLife": "0",
                "isFssaiApplicable": " ",
                "isInflammable": "N",
                "dpcoDiscountFlag": "N",
                "internalTransferable": "Y",
                "pendingStatus": 2,
                "inventoryLeastExpDate": "3-5-23 12:00:00 AM",
                "brandColour": "Black",
                "optionCode": "",
                "verticalSpecification": "Beauty",
                "b2bAttributes": {
                    "marginPercentage": 0,
                    "isActive": true,
                    "ptrPercentage": 0,
                    "ptrPercentageType": " ",
                    "minimumQty": 1,
                    "maximumQty": 999999,
                    "defaultQty": 1,
                    "minMargin": 12,
                    "unitSaleFlag": "N",
                    "unitCount": "1"
                },
                "dimensions": {
                    "productRating": 0,
                    "productSize": ""
                },
                "brandDetails": {
                    "brandId": 119715,
                    "brandFilter": "Miss Claire",
                    "brandGroupName": ""
                },
                "itemPriceDetails": {
                    "mrp": 125,
                    "itemDiscount": 0.2,
                    "dpcoCeilingMrp": 0,
                    "flatDiscount": 0,
                    "brandDiscount": 0
                },
                "genericDetails": {
                    "genericName": "Eyes",
                    "genericDosage": "Eyes",
                    "genericNameWithDosage": "Eyes"
                },
                "marketerDetails": {
                    "marketerId": 4833,
                    "marketerName": "false",
                    "marketerAddress": "NA",
                    "divisionName": "Eureka Cosmo Pvt Ltd"
                },
                "manufactureDetails": {
                    "manufactureId": 3,
                    "manufactureName": "NA",
                    "manufactureAddress": "NA"
                },
                "importerDetails": {
                    "importerName": "",
                    "importerAddress": ""
                },
                "cimisCateogryDetails": {
                    "cimsCategoryName": "OTC",
                    "cimsClassification": "OTC",
                    "cimsSubCategoryName": "OTC"
                },
                "taxDetails": {
                    "hsnCode": "33049990",
                    "taxPercentage": "18P"
                },
                "similarProducts": [
                    "958320",
                    "958321",
                    "958332",
                    "958317"
                ],
                "alternateProducts": [],
                "boughtTogetherProducts": [
                    "SH11124",
                    "SH11125"
                ],
                "additionalInformation": {
                    "netQty": "",
                    "shelfLife": "NA",
                    "unitsInKit": "",
                    "ingredients": "",
                    "vegOrNonVeg": "",
                    "nutritionInfo": "",
                    "customerCareNo": "+91-7200712345",
                    "itemDimensions": "NA",
                    "certificationNo": "",
                    "directionsToUse": "",
                    "safetyPrecaution": "",
                    "customerCareEmail": "",
                    "productsInsideKit": "",
                    "guaranteesOrWarranties": "",
                    "certificationApplicable": ""
                },
                "seoContent": {
                    "seoTitle": "Buy Miss Claire Waterproof Eyebrow Pencil 01 Black (Mascara Brush) 1.4 Gm Online at Discounted Price | Netmeds",
                    "seoMetaDescription": "Miss Claire Waterproof Eyebrow Pencil 01 Black (Mascara Brush) 1.4 Gm: Buy Miss Claire Waterproof Eyebrow Pencil 01 Black (Mascara Brush) 1.4 Gm online at best price on Netmeds. Order now to get fastest delivery at your doorsteps. ✔COD ✔Pan India Delivery",
                    "seoMetaKeywords": "Miss Claire Waterproof Eyebrow Pencil 01 Black (Mascara Brush) 1.4 Gm, Miss Claire Waterproof Eyebrow Pencil 01 Black (Mascara Brush) 1.4 Gm online , buy Miss Claire Waterproof Eyebrow Pencil 01 Black (Mascara Brush) 1.4 Gm, buy Miss Claire Waterproof Eyebrow Pencil 01 Black (Mascara Brush) 1.4 Gm online, Netmeds"
                },
                "itemContent": [
                    {
                        "key": "Description",
                        "value": "Achieve that precise & natural brow definition in no time with Miss Claire waterproof eyebrow pencil with Mascara brush. A multi-functional, slim, waterproof, immensely pigmented brow product for a guaranteed flawless application. The pencil also features a brow brush (Spoolie) on the opposite end for an 2in1 brow tool. Excellent color pay off with it's fine tip and a spoolie that gives you natural looking brow hair for your perfect arch.\n"
                    },
                    {
                        "key": "Key Benefit",
                        "value": ""
                    },
                    {
                        "key": "Direction For Use",
                        "value": "Step1: Ensure the tip of the pencil is sharp to mimic precise natural brow hair\nStep2: Following the shape of your brows to create a natural, fuller look\nStep3: Fill by drawing short, upward strokes in the direction of your natural hair growth\nStep4: Use the given spoolie brush to blend the product and tame your brows\n"
                    },
                    {
                        "key": "Safety Information",
                        "value": ""
                    },
                    {
                        "key": "Other Information",
                        "value": ""
                    }
                ],
                "productCategory": [
                    {
                        "categoryIdLevel1": 3431,
                        "categoryNameLevel1": "Make-Up",
                        "categoryImageLevel1": "https://www.netmeds.com/images/category/v1/3431/make_up.jpg",
                        "categoryThumbImageLevel1": "https://www.netmeds.com/images/category/prod/thumb/make-up.png",
                        "categoryIdLevel2": 3442,
                        "categoryNameLevel2": "Eyes",
                        "categoryImageLevel2": "https://www.netmeds.com/images/category/v1/3442/eyes.jpg",
                        "categoryThumbImageLevel2": "https://www.netmeds.com/images/category/prod/thumb/eyes.png",
                        "categoryIdLevel3": 3721,
                        "categoryNameLevel3": "Eyebrow Pencils & Enhancers",
                        "categoryImageLevel3": "https://www.netmeds.com/images/category/v1/3721/eyebrow_pencils_enhancers.jpg",
                        "categoryThumbImageLevel3": "https://www.netmeds.com/images/category/v1/3721/thumb/eyebrow_pencils_enhancers_200.jpg",
                        "defaultCategory": "Y"
                    }
                ],
                "productImageUrl": [
                    {
                        "imageUrl": "https://www.netmeds.com/images/product-v1/600x600/948319/miss_claire_waterproof_eyebrow_pencil_01_black_mascara_brush_1_4_gm_228767_0_1.jpg",
                        "priorityLevel": "0"
                    },
                    {
                        "imageUrl": "https://www.netmeds.com/images/product-v1/600x600/948319/miss_claire_waterproof_eyebrow_pencil_01_black_mascara_brush_1_4_gm_228768_1_1.jpg",
                        "priorityLevel": 1
                    },
                    {
                        "imageUrl": "https://www.netmeds.com/images/product-v1/600x600/948319/miss_claire_waterproof_eyebrow_pencil_01_black_mascara_brush_1_4_gm_228769_2_1.jpg",
                        "priorityLevel": 2
                    },
                    {
                        "imageUrl": "https://www.netmeds.com/images/product-v1/600x600/948319/miss_claire_waterproof_eyebrow_pencil_01_black_mascara_brush_1_4_gm_228770_3_1.jpg",
                        "priorityLevel": 3
                    }
                ],
                "productVideoUrl": [
                    {
                        "videoImagePath": "",
                        "videoUrl": ""
                    }
                ],
                "algoliaFacet": {
                    "general": {
                        "Product Characteristic": [
                            "steph",
                            "kd"
                        ],
                        "Skin Type": [
                            "All Skin Types"
                        ]
                    }
                },
                "productVariant": [],
                "additionVerticalInfo": {
                    "fynd": {
                        "channelId": "JIOMART"
                    },
                    "mdh": {
                        "channelIds": [
                            "JIOMART",
                            "NETMEDS",
                            "NETMEDS-B2B"
                        ]
                    }
                },
                "mstarAttributes": {
                    "stockQty": 330,
                    "sellingPrice": 100,
                    "discountRate": 100,
                    "maxDiscountPct": 20,
                    "rxRequired": "Rx not requried",
                    "isReturnable": "Y",
                    "isHighValue": "N",
                    "packLabel": "",
                    "displayNameWoPs": "Miss Claire Waterproof Eyebrow Pencil 01 Black (Mascara Brush)",
                    "genericId": 11219,
                    "genericWithDosageId": 54089,
                    "healthConcernId": "",
                    "soldQtyForRank": 0,
                    "maxDiscount": 100,
                    "updatedTime": "1/19/2023 9:06:05 AM",
                    "bestPrice": 100.0000000,
                    "discount": 100,
                    "discountPct": 20
                },
                "fyndDefaultAttributes": {
                    "name": "Miss Claire Waterproof Eyebrow Pencil 01 Black (Mascara Brush) 1.4 Gm",
                    "itemCode": 948314,
                    "brand": "Miss Claire Waterproof Eyebrow Pencil 01 Black (Mascara Brush) Test inbound 123",
                    "category": "Eyebrow Pencils & Enhancers",
                    "reportingHsnCode": "33049990H1",
                    "gtinType": "SKU",
                    "gtinValue": -948319,
                    "sellerIdentifier": 123,
                    "size": 1.4,
                    "actualPrice": 125,
                    "sellingPrice": 100,
                    "currency": "INR",
                    "length": 2,
                    "width": 2,
                    "height": 2,
                    "productDeadWeight": 11,
                    "traderType": "local",
                    "traderName": "NAD",
                    "traderAddress": "Mumbai India",
                    "returnTimeLimit": 7,
                    "returnTimeUnit": "Days",
                    "productPublishingDate": "Jan",
                    "tags": "12131",
                    "netQuantityValue": "1",
                    "netQuantityUnit": "1",
                    "productBundle": "1",
                    "description": "<body>\n    <header>\n        <h1>Welcome to Our Anime Website</h1>\n    </header>\n    <div class=\"container\">\n        <h2>Latest Anime Releases</h2>\n        <ul>\n            <li>\n                <img class=\"anime-image\" src=\"https://wallpaper.forfun.com/fetch/7a/7ab7e1a43701752ec0672545cffee087.jpeg\" alt=\"Anime Title 1\">\n                <a href=\"anime1.html\">Anime Title 1</a>\n            </li>\n            <li>\n                <img class=\"anime-image\" src=\"https://c4.wallpaperflare.com/wallpaper/205/785/286/gintama-japanese-anime-wallpaper-preview.jpg\" alt=\"Anime Title 2\">\n                <a href=\"anime2.html\">Anime Title 2</a>\n            </li>\n            <li>\n                <img class=\"anime-image\" src=\"https://images2.alphacoders.com/227/227642.jpg\" alt=\"Anime Title 3\">\n                <a href=\"anime3.html\">Anime Title 3</a>\n            </li>\n            <!-- Add more anime entries as needed -->\n        </ul>\n        <h2>Popular Genres</h2>\n        <section>\n            <h3>Action</h3>\n            <ul>\n                <li><a href=\"action1.html\">Action Anime 1</a></li>\n                <li><a href=\"action2.html\">Action Anime 2</a></li>\n                <!-- Add more action anime titles as needed -->\n            </ul>\n        </section>\n        <section>\n            <h3>Fantasy</h3>\n            <ul>\n                <li><a href=\"fantasy1.html\">Fantasy Anime 1</a></li>\n                <li><a href=\"fantasy2.html\">Fantasy Anime 2</a></li>\n                <!-- Add more fantasy anime titles as needed -->\n            </ul>\n        </section>\n        <section>\n            <h3>Romance</h3>\n            <ul>\n                <li><a href=\"romance1.html\">Romance Anime 1</a></li>\n                <li><a href=\"romance2.html\">Romance Anime 2</a></li>\n                <!-- Add more romance anime titles as needed -->\n            </ul>\n        </section>\n        <!-- Add more genre sections as needed -->\n        <h2>Contact Us</h2>\n        <p>\n            Have any questions or suggestions? Feel free to <a href=\"contact.html\">contact us</a>.\n        </p>\n    </div>\n</body>",
                    "shortDescription": "Mand Test pce change",
                    "media": [
                        "https://cdn.pixelbin.io/v2/catalog-cloud/original/Asset/GD_AS169.jpg",
                        "https://cdn.pixelbin.io/v2/catalog-cloud/original/Asset/GD_ezgif.com-gif-to-webp.webp"
                    ],
                    "file": [
                        "https://cdn.pixelbin.io/v2/catalog-cloud/original/AssetFiles/GD_Extlst-test.pptx",
                        "https://cdn.pixelbin.io/v2/catalog-cloud/original/AssetFiles/GD_file-sample_1MB.docx"
                    ],
                    "media2": [
                        "https://cdn.pixelbin.io/v2/catalog-cloud/original/Asset/GD_768x768.gif",
                        "https://cdn.pixelbin.io/v2/catalog-cloud/original/Asset/GD_Screenshot_2023-03-09_at_5.30.30_PM.png"
                    ],
                    "file2": [
                        "https://cdn.pixelbin.io/v2/catalog-cloud/original/AssetFiles/GD_sample.pdf",
                        "https://cdn.pixelbin.io/v2/catalog-cloud/original/AssetFiles/GD_z0UserData.txt"
                    ],
                    "multiSize": "Yes",
                    "meta": "Test Meta",
                    "sizeMeta": "Meta Test",
                    "sizeGuide": "Test SG",
                    "available": "yes",
                    "highlights": "HL",
                    "dependentProduct": "DPRO",
                    "variantType": "Single",
                    "variantGroupID": "12312",
                    "variantMedia": "LocNess",
                    "trackInventory": "yes",
                    "teaserTagName": "TG Name",
                    "countryOfOrigin": "India",
                    "manufacturingTime": "2 Day",
                    "noOfBoxes": "12",
                    "manufacturingTimeUnit": "Day"
                },
                "newAttributes": {
                    "flexiAttribute1": "",
                    "flexiAttribute2": "",
                    "flexiAttribute3": "",
                    "flexiAttribute4": "",
                    "flexiAttribute5": "",
                    "isFmcg": "",
                    "beautyHighlightsPreference": "",
                    "beautyHighlightsIngredients": "",
                    "beautyHighlightsFormulation": "",
                    "beautyHighlightsFinish": "",
                    "beautyHighlightsSkinType": "",
                    "beautyHighlightsCoverage": ""
                },
                "pharmaDescription": ""
            },
            "mdh_meta": {
                "source": "littleboy",
                "vertical": "Beauty",
                "channel_id": [
                    "JIOMART",
                    "NETMEDS",
                    "NETMEDS-B2B"
                ],
                "cms_attributes": {
                    "sku_code": generateCodeNameString('Avi_Test_Loop'),
                    "identifier_type": "CREATED_BY_CMS",
                    "category_tree_id": "CT_489"
                },
                "others": {},
                "event": {
                    "name": "product",
                    "type": "create",
                    "version": "1"
                }
            }
        },
        "meta": {
            "event": {
                "name": "product",
                "source": "littleboy",
                "version": "1",
                "type": "upsert",
                "vertical": "Beauty",
                "channel_id": [
                    "JIOMART",
                    "NETMEDS",
                    "NETMEDS-B2B"
                ]
            },
            "organization_id": 1,
            "trace_id": [
                "mdh-data-ingestion-layer.f28c9997e70e69e4292b3666ee90a443"
            ],
            "created_timestamp": 1700468147092,
            "service": {
                "name": "mdh-data-ingestion-layer"
            },
            "tags": [
                "littleboy",
                "product"
            ]
        }
    }
    return pload;
}

const pload = {
    "payload": {
        "product": {
            "itemCode": 948314,
            "availabilityStatus": "A",
            "activeStatus": false,
            "productType": "O",
            "schedule": "M",
            "itemType": "PENCIL",
            "packageType": "Pencil",
            "packSize": "1.4",
            "packSizeUnit": "gm",
            "dosage": "0",
            "dosageUnit": "",
            "cartMinQty": 12,
            "cartMaxQty": 5,
            "searchKeys": "Eyebrow Enhancer",
            "inventoryLookup": "Y",
            "refundStatus": "Y",
            "coldStorage": "N",
            "dpcoStatus": "N",
            "foodLabel": "N",
            "eanCode": "8903487044432",
            "boxQty": 0,
            "unitSaleFlag": "N",
            "onlineSaleStatus": "Both",
            "unitCount": 1,
            "procuredBy": "Beauty",
            "popularity": 0,
            "brandOrGeneric": "B",
            "refillStatus": " ",
            "createdDate": "5/25/2021 11:32:32 AM",
            "modifiedDate": "2/10/2023 9:06:05 AM",
            "createdBy": "raashi",
            "modifiedBy": "Ushasurajmani",
            "requestBy": "Brand",
            "isAllowPayment": "Y",
            "catalogVisibility": true,
            "searchVisibility": true,
            "releaseTypeName": "",
            "fssaiNo": "0",
            "otxFlag": false,
            "isVegItem": " ",
            "boxPackQty": 0,
            "cartonQty": 0,
            "intakeShelfLife": "540",
            "outwardShelfLife": "240",
            "vendorNonReturnable": " ",
            "sapCode": "492492792",
            "inventoryMaxQty": 0,
            "inventoryMinQty": 0,
            "shortExpiry": 0,
            "dlFlag": "true rock 12",
            "truuthFlag": "true numb 45",
            "recommQty": 15,
            "itemShelfLife": "0",
            "isFssaiApplicable": " ",
            "isInflammable": "N",
            "dpcoDiscountFlag": "N",
            "internalTransferable": "Y",
            "pendingStatus": 2,
            "inventoryLeastExpDate": "3-5-23 12:00:00 AM",
            "brandColour": "Black",
            "optionCode": "",
            "verticalSpecification": "Beauty",
            "b2bAttributes": {
                "marginPercentage": 0,
                "isActive": true,
                "ptrPercentage": 0,
                "ptrPercentageType": " ",
                "minimumQty": 1,
                "maximumQty": 999999,
                "defaultQty": 1,
                "minMargin": 12,
                "unitSaleFlag": "N",
                "unitCount": "1"
            },
            "dimensions": {
                "productRating": 0,
                "productSize": ""
            },
            "brandDetails": {
                "brandId": 119715,
                "brandFilter": "Miss Claire",
                "brandGroupName": ""
            },
            "itemPriceDetails": {
                "mrp": 125,
                "itemDiscount": 0.2,
                "dpcoCeilingMrp": 0,
                "flatDiscount": 0,
                "brandDiscount": 0
            },
            "genericDetails": {
                "genericName": "Eyes",
                "genericDosage": "Eyes",
                "genericNameWithDosage": "Eyes"
            },
            "marketerDetails": {
                "marketerId": 4833,
                "marketerName": "false",
                "marketerAddress": "NA",
                "divisionName": "Eureka Cosmo Pvt Ltd"
            },
            "manufactureDetails": {
                "manufactureId": 3,
                "manufactureName": "NA",
                "manufactureAddress": "NA"
            },
            "importerDetails": {
                "importerName": "",
                "importerAddress": ""
            },
            "cimisCateogryDetails": {
                "cimsCategoryName": "OTC",
                "cimsClassification": "OTC",
                "cimsSubCategoryName": "OTC"
            },
            "taxDetails": {
                "hsnCode": "33049990",
                "taxPercentage": "18P"
            },
            "similarProducts": [
                "958320",
                "958321",
                "958332",
                "958317"
            ],
            "alternateProducts": [],
            "boughtTogetherProducts": [
                "SH11124",
                "SH11125"
            ],
            "additionalInformation": {
                "netQty": "",
                "shelfLife": "NA",
                "unitsInKit": "",
                "ingredients": "",
                "vegOrNonVeg": "",
                "nutritionInfo": "",
                "customerCareNo": "+91-7200712345",
                "itemDimensions": "NA",
                "certificationNo": "",
                "directionsToUse": "",
                "safetyPrecaution": "",
                "customerCareEmail": "",
                "productsInsideKit": "",
                "guaranteesOrWarranties": "",
                "certificationApplicable": ""
            },
            "seoContent": {
                "seoTitle": "Buy Miss Claire Waterproof Eyebrow Pencil 01 Black (Mascara Brush) 1.4 Gm Online at Discounted Price | Netmeds",
                "seoMetaDescription": "Miss Claire Waterproof Eyebrow Pencil 01 Black (Mascara Brush) 1.4 Gm: Buy Miss Claire Waterproof Eyebrow Pencil 01 Black (Mascara Brush) 1.4 Gm online at best price on Netmeds. Order now to get fastest delivery at your doorsteps. ✔COD ✔Pan India Delivery",
                "seoMetaKeywords": "Miss Claire Waterproof Eyebrow Pencil 01 Black (Mascara Brush) 1.4 Gm, Miss Claire Waterproof Eyebrow Pencil 01 Black (Mascara Brush) 1.4 Gm online , buy Miss Claire Waterproof Eyebrow Pencil 01 Black (Mascara Brush) 1.4 Gm, buy Miss Claire Waterproof Eyebrow Pencil 01 Black (Mascara Brush) 1.4 Gm online, Netmeds"
            },
            "itemContent": [
                {
                    "key": "Description",
                    "value": "Achieve that precise & natural brow definition in no time with Miss Claire waterproof eyebrow pencil with Mascara brush. A multi-functional, slim, waterproof, immensely pigmented brow product for a guaranteed flawless application. The pencil also features a brow brush (Spoolie) on the opposite end for an 2in1 brow tool. Excellent color pay off with it's fine tip and a spoolie that gives you natural looking brow hair for your perfect arch.\n"
                },
                {
                    "key": "Key Benefit",
                    "value": ""
                },
                {
                    "key": "Direction For Use",
                    "value": "Step1: Ensure the tip of the pencil is sharp to mimic precise natural brow hair\nStep2: Following the shape of your brows to create a natural, fuller look\nStep3: Fill by drawing short, upward strokes in the direction of your natural hair growth\nStep4: Use the given spoolie brush to blend the product and tame your brows\n"
                },
                {
                    "key": "Safety Information",
                    "value": ""
                },
                {
                    "key": "Other Information",
                    "value": ""
                }
            ],
            "productCategory": [
                {
                    "categoryIdLevel1": 3431,
                    "categoryNameLevel1": "Make-Up",
                    "categoryImageLevel1": "https://www.netmeds.com/images/category/v1/3431/make_up.jpg",
                    "categoryThumbImageLevel1": "https://www.netmeds.com/images/category/prod/thumb/make-up.png",
                    "categoryIdLevel2": 3442,
                    "categoryNameLevel2": "Eyes",
                    "categoryImageLevel2": "https://www.netmeds.com/images/category/v1/3442/eyes.jpg",
                    "categoryThumbImageLevel2": "https://www.netmeds.com/images/category/prod/thumb/eyes.png",
                    "categoryIdLevel3": 3721,
                    "categoryNameLevel3": "Eyebrow Pencils & Enhancers",
                    "categoryImageLevel3": "https://www.netmeds.com/images/category/v1/3721/eyebrow_pencils_enhancers.jpg",
                    "categoryThumbImageLevel3": "https://www.netmeds.com/images/category/v1/3721/thumb/eyebrow_pencils_enhancers_200.jpg",
                    "defaultCategory": "Y"
                }
            ],
            "productImageUrl": [
                {
                    "imageUrl": "https://www.netmeds.com/images/product-v1/600x600/948319/miss_claire_waterproof_eyebrow_pencil_01_black_mascara_brush_1_4_gm_228767_0_1.jpg",
                    "priorityLevel": "0"
                },
                {
                    "imageUrl": "https://www.netmeds.com/images/product-v1/600x600/948319/miss_claire_waterproof_eyebrow_pencil_01_black_mascara_brush_1_4_gm_228768_1_1.jpg",
                    "priorityLevel": 1
                },
                {
                    "imageUrl": "https://www.netmeds.com/images/product-v1/600x600/948319/miss_claire_waterproof_eyebrow_pencil_01_black_mascara_brush_1_4_gm_228769_2_1.jpg",
                    "priorityLevel": 2
                },
                {
                    "imageUrl": "https://www.netmeds.com/images/product-v1/600x600/948319/miss_claire_waterproof_eyebrow_pencil_01_black_mascara_brush_1_4_gm_228770_3_1.jpg",
                    "priorityLevel": 3
                }
            ],
            "productVideoUrl": [
                {
                    "videoImagePath": "",
                    "videoUrl": ""
                }
            ],
            "algoliaFacet": {
                "general": {
                    "Product Characteristic": [
                        "steph",
                        "kd"
                    ],
                    "Skin Type": [
                        "All Skin Types"
                    ]
                }
            },
            "productVariant": [],
            "additionVerticalInfo": {
                "fynd": {
                    "channelId": "JIOMART"
                },
                "mdh": {
                    "channelIds": [
                        "JIOMART",
                        "NETMEDS",
                        "NETMEDS-B2B"
                    ]
                }
            },
            "mstarAttributes": {
                "stockQty": 330,
                "sellingPrice": 100,
                "discountRate": 100,
                "maxDiscountPct": 20,
                "rxRequired": "Rx not requried",
                "isReturnable": "Y",
                "isHighValue": "N",
                "packLabel": "",
                "displayNameWoPs": "Miss Claire Waterproof Eyebrow Pencil 01 Black (Mascara Brush)",
                "genericId": 11219,
                "genericWithDosageId": 54089,
                "healthConcernId": "",
                "soldQtyForRank": 0,
                "maxDiscount": 100,
                "updatedTime": "1/19/2023 9:06:05 AM",
                "bestPrice": 100.0000000,
                "discount": 100,
                "discountPct": 20
            },
            "fyndDefaultAttributes": {
                "name": "Miss Claire Waterproof Eyebrow Pencil 01 Black (Mascara Brush) 1.4 Gm",
                "itemCode": 948314,
                "brand": "Miss Claire Waterproof Eyebrow Pencil 01 Black (Mascara Brush) Test inbound 123",
                "category": "Eyebrow Pencils & Enhancers",
                "reportingHsnCode": "33049990H1",
                "gtinType": "SKU",
                "gtinValue": -948319,
                "sellerIdentifier": 123,
                "size": 1.4,
                "actualPrice": 125,
                "sellingPrice": 100,
                "currency": "INR",
                "length": 2,
                "width": 2,
                "height": 2,
                "productDeadWeight": 11,
                "traderType": "local",
                "traderName": "NAD",
                "traderAddress": "Mumbai India",
                "returnTimeLimit": 7,
                "returnTimeUnit": "Days",
                "productPublishingDate": "Jan",
                "tags": "12131",
                "netQuantityValue": "1",
                "netQuantityUnit": "1",
                "productBundle": "1",
                "description": "<body>\n    <header>\n        <h1>Welcome to Our Anime Website</h1>\n    </header>\n    <div class=\"container\">\n        <h2>Latest Anime Releases</h2>\n        <ul>\n            <li>\n                <img class=\"anime-image\" src=\"https://wallpaper.forfun.com/fetch/7a/7ab7e1a43701752ec0672545cffee087.jpeg\" alt=\"Anime Title 1\">\n                <a href=\"anime1.html\">Anime Title 1</a>\n            </li>\n            <li>\n                <img class=\"anime-image\" src=\"https://c4.wallpaperflare.com/wallpaper/205/785/286/gintama-japanese-anime-wallpaper-preview.jpg\" alt=\"Anime Title 2\">\n                <a href=\"anime2.html\">Anime Title 2</a>\n            </li>\n            <li>\n                <img class=\"anime-image\" src=\"https://images2.alphacoders.com/227/227642.jpg\" alt=\"Anime Title 3\">\n                <a href=\"anime3.html\">Anime Title 3</a>\n            </li>\n            <!-- Add more anime entries as needed -->\n        </ul>\n        <h2>Popular Genres</h2>\n        <section>\n            <h3>Action</h3>\n            <ul>\n                <li><a href=\"action1.html\">Action Anime 1</a></li>\n                <li><a href=\"action2.html\">Action Anime 2</a></li>\n                <!-- Add more action anime titles as needed -->\n            </ul>\n        </section>\n        <section>\n            <h3>Fantasy</h3>\n            <ul>\n                <li><a href=\"fantasy1.html\">Fantasy Anime 1</a></li>\n                <li><a href=\"fantasy2.html\">Fantasy Anime 2</a></li>\n                <!-- Add more fantasy anime titles as needed -->\n            </ul>\n        </section>\n        <section>\n            <h3>Romance</h3>\n            <ul>\n                <li><a href=\"romance1.html\">Romance Anime 1</a></li>\n                <li><a href=\"romance2.html\">Romance Anime 2</a></li>\n                <!-- Add more romance anime titles as needed -->\n            </ul>\n        </section>\n        <!-- Add more genre sections as needed -->\n        <h2>Contact Us</h2>\n        <p>\n            Have any questions or suggestions? Feel free to <a href=\"contact.html\">contact us</a>.\n        </p>\n    </div>\n</body>",
                "shortDescription": "Mand Test pce change",
                "media": [
                    "https://cdn.pixelbin.io/v2/catalog-cloud/original/Asset/GD_AS169.jpg",
                    "https://cdn.pixelbin.io/v2/catalog-cloud/original/Asset/GD_ezgif.com-gif-to-webp.webp"
                ],
                "file": [
                    "https://cdn.pixelbin.io/v2/catalog-cloud/original/AssetFiles/GD_Extlst-test.pptx",
                    "https://cdn.pixelbin.io/v2/catalog-cloud/original/AssetFiles/GD_file-sample_1MB.docx"
                ],
                "media2": [
                    "https://cdn.pixelbin.io/v2/catalog-cloud/original/Asset/GD_768x768.gif",
                    "https://cdn.pixelbin.io/v2/catalog-cloud/original/Asset/GD_Screenshot_2023-03-09_at_5.30.30_PM.png"
                ],
                "file2": [
                    "https://cdn.pixelbin.io/v2/catalog-cloud/original/AssetFiles/GD_sample.pdf",
                    "https://cdn.pixelbin.io/v2/catalog-cloud/original/AssetFiles/GD_z0UserData.txt"
                ],
                "multiSize": "Yes",
                "meta": "Test Meta",
                "sizeMeta": "Meta Test",
                "sizeGuide": "Test SG",
                "available": "yes",
                "highlights": "HL",
                "dependentProduct": "DPRO",
                "variantType": "Single",
                "variantGroupID": "12312",
                "variantMedia": "LocNess",
                "trackInventory": "yes",
                "teaserTagName": "TG Name",
                "countryOfOrigin": "India",
                "manufacturingTime": "2 Day",
                "noOfBoxes": "12",
                "manufacturingTimeUnit": "Day"
            },
            "newAttributes": {
                "flexiAttribute1": "",
                "flexiAttribute2": "",
                "flexiAttribute3": "",
                "flexiAttribute4": "",
                "flexiAttribute5": "",
                "isFmcg": "",
                "beautyHighlightsPreference": "",
                "beautyHighlightsIngredients": "",
                "beautyHighlightsFormulation": "",
                "beautyHighlightsFinish": "",
                "beautyHighlightsSkinType": "",
                "beautyHighlightsCoverage": ""
            },
            "pharmaDescription": ""
        },
        "mdh_meta": {
            "source": "littleboy",
            "vertical": "Beauty",
            "channel_id": [
                "JIOMART",
                "NETMEDS",
                "NETMEDS-B2B"
            ],
            "cms_attributes": {
                "sku_code": generateCodeNameString('Avi_Test_Loop'),
                "identifier_type": "CREATED_BY_CMS",
                "category_tree_id": "CT_489"
            },
            "others": {},
            "event": {
                "name": "product",
                "type": "create",
                "version": "1"
            }
        }
    },
    "meta": {
        "event": {
            "name": "product",
            "source": "littleboy",
            "version": "1",
            "type": "upsert",
            "vertical": "Beauty",
            "channel_id": [
                "JIOMART",
                "NETMEDS",
                "NETMEDS-B2B"
            ]
        },
        "organization_id": 1,
        "trace_id": [
            "mdh-data-ingestion-layer.f28c9997e70e69e4292b3666ee90a443"
        ],
        "created_timestamp": 1700468147092,
        "service": {
            "name": "mdh-data-ingestion-layer"
        },
        "tags": [
            "littleboy",
            "product"
        ]
    }
}