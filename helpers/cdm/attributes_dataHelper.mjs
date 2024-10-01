import { faker } from '@faker-js/faker';

let booleanStates = [true, false];
let acceptableFormattingValues = ["None", "Uppercase", "Lowercase"];
let tagsArray = [];
let allowedValuesArray = [];
let descriptionString = "";

function generateCodeNameString(stringText) {
    const randomPosition = faker.number.int({ min: 0, max: 2 });
    let prefix = '';
    let suffix = '';
    if (randomPosition === 0) {
        suffix = faker.string.alphaNumeric(stringText.length);
    } else if (randomPosition === 1) {
        prefix = faker.string.alphaNumeric(faker.number.int({ min: 0, max: stringText.length }));
        suffix = faker.string.alphaNumeric(faker.number.int({ min: 0, max: stringText.length }));
    } else {
        prefix = faker.string.alphaNumeric(stringText.length);
    }
    const generatedString = prefix + stringText + suffix;
    return generatedString.trim();
}

function tagsArrayData() {
    const tagsArraySize = faker.number.int({ min: 0, max: 15 });
    for (let i = 0; i < tagsArraySize; i++) {
        tagsArray.push(faker.string.alpha(5));
    }
    return tagsArray;
}
function allowedValuesData() {
    const allowedValuesSize = faker.number.int({ min: 0, max: 15 });
    for (let i = 0; i < allowedValuesSize; i++) {
        allowedValuesArray.push(faker.string.alpha(7));
    }
    return allowedValuesArray;
}

function generateDescString() {
    const stringWordCap = faker.number.int({ min: 0, max: 100 });
    for (let i = 0; i < stringWordCap; i++) {
        descriptionString = `${descriptionString} ${faker.string.alpha(faker.number.int({ min: 0, max: 10 }))}`;
    }
    return descriptionString;
}

export function createShortTextAttributePayload(stringText) {
    const allowedValues = allowedValuesData();
    const tagsData = tagsArrayData();
    const descriptionString = generateDescString();
    const generatedName = generateCodeNameString(stringText);
    const generatedCode = generateCodeNameString(stringText);
    const payload = {
        active: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        name: generatedName,
        code: generatedCode,
        description: descriptionString.trim(),
        tags: tagsData,
        type: "Short Text",
        mandatory: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        auto_sync_to_prod: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        formatting: acceptableFormattingValues[Math.floor(Math.random() * acceptableFormattingValues.length)],
        limit: faker.number.int({ min: 1, max: 200 }),
        allowed_values: allowedValues,
        vms_visible: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        vms_editable: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        store_filter: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        store_display_plp: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        store_display_pdp: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        store_search: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        store_compare: booleanStates[Math.floor(Math.random() * booleanStates.length)]
    }
    return payload;
}

export function createParagraphAttributePayload(stringText) {
    const tagsData = tagsArrayData();
    const descriptionString = generateDescString();
    const generatedName = generateCodeNameString(stringText);
    const generatedCode = generateCodeNameString(stringText);
    const payload = {
        active: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        name: generatedName,
        code: generatedCode,
        description: descriptionString.trim(),
        tags: tagsData,
        type: "Paragraph",
        mandatory: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        auto_sync_to_prod: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        limit: faker.number.int({ min: 1, max: 200 }),
        vms_visible: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        vms_editable: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        store_filter: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        store_display_plp: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        store_display_pdp: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        store_search: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        store_compare: booleanStates[Math.floor(Math.random() * booleanStates.length)]
    }
    return payload;
}

export function createNumberAttributePayload(stringText) {
    const tagsData = tagsArrayData();
    const descriptionString = generateDescString();
    const maxVal = faker.number.int({ min: -100000, max: 100000 });
    const minVal = faker.number.int({ min: -100000, max: maxVal });
    const generatedName = generateCodeNameString(stringText);
    const generatedCode = generateCodeNameString(stringText);
    const payload = {
        active: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        name: generatedName,
        code: generatedCode,
        description: descriptionString.trim(),
        tags: tagsData,
        type: "Number",
        mandatory: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        auto_sync_to_prod: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        vms_visible: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        vms_editable: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        store_filter: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        store_display_plp: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        store_display_pdp: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        store_search: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        store_compare: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        max: maxVal,
        min: minVal
    }
    return payload;
}

export function createDecimalAttributePayload(stringText) {
    const tagsData = tagsArrayData();
    const descriptionString = generateDescString();
    const maxVal = faker.number.int({ min: -100000, max: 100000, precision: 0.01 });
    const minVal = faker.number.int({ min: -100000, max: maxVal, precision: 0.01 });
    const generatedName = generateCodeNameString(stringText);
    const generatedCode = generateCodeNameString(stringText);
    const payload = {
        active: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        name: generatedName,
        code: generatedCode,
        description: descriptionString.trim(),
        tags: tagsData,
        type: "Decimal",
        mandatory: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        auto_sync_to_prod: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        vms_visible: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        vms_editable: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        store_filter: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        store_display_pdp: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        store_display_plp: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        store_search: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        store_compare: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        max: maxVal,
        min: minVal
    }
    return payload;
}

export function createListAttributePayload(stringText) {
    const allowedValues = allowedValuesData();
    const tagsData = tagsArrayData();
    const descriptionString = generateDescString();
    const generatedName = generateCodeNameString(stringText);
    const generatedCode = generateCodeNameString(stringText);
    const payload = {
        active: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        name: generatedName,
        code: generatedCode,
        description: descriptionString.trim(),
        tags: tagsData,
        type: "List",
        mandatory: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        auto_sync_to_prod: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        formatting: acceptableFormattingValues[Math.floor(Math.random() * acceptableFormattingValues.length)],
        limit: faker.number.int({ min: 1, max: 200 }),
        allowed_values: allowedValues,
        allow_multiple: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        vms_visible: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        vms_editable: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        store_filter: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        store_display_pdp: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        store_display_plp: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        store_search: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        store_compare: booleanStates[Math.floor(Math.random() * booleanStates.length)]
    }
    return payload;
}

export function createFileAttributePayload(stringText) {
    const fileAllowedValues = ["pdf", "doc", "docx", "csv", "txt", "ppt", "pptx"];
    const fileAllowedArray = [];
    const fileAllowedArraySize = faker.number.int({ min: 0, max: 6 });
    for (let i = 0; i < fileAllowedArraySize; i++) {
        fileAllowedArray.push(fileAllowedValues[i]);
    }
    const tagsData = tagsArrayData();
    const descriptionString = generateDescString();
    const generatedName = generateCodeNameString(stringText);
    const generatedCode = generateCodeNameString(stringText);
    const payload = {
        active: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        name: generatedName,
        code: generatedCode,
        description: descriptionString.trim(),
        tags: tagsData,
        type: "File",
        mandatory: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        auto_sync_to_prod: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        allowed_extensions: fileAllowedArray,
        max_size: faker.number.int({ min: 1, max: 200 }),
        allow_multiple: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        vms_visible: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        vms_editable: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        store_filter: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        store_display_pdp: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        store_display_plp: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        store_search: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        store_compare: booleanStates[Math.floor(Math.random() * booleanStates.length)]
    }
    return payload;
}

export function createMediaAttributePayload(stringText) {
    const fileAllowedValues = ["jpeg", "png", "gif", "webp", "jfif", "mp4", "mov"];
    const mediaTypes = ["image", "video"]
    const selMediaType = mediaTypes[Math.floor(Math.random() * mediaTypes.length)];
    const fileAllowedArray = [];
    if (selMediaType === 'image') {
        const fileAllowedArraySize = faker.number.int({ min: 1, max: 5 });
        for (let i = 0; i < fileAllowedArraySize; i++) {
            fileAllowedArray.push(fileAllowedValues[i]);
        }
    }
    else if (selMediaType === 'video') {
        const fileAllowedArraySize = faker.number.int({ min: 1, max: 2 });
        for (let i = 0; i < fileAllowedArraySize; i++) {
            fileAllowedArray.push(fileAllowedValues[i + 5]);
        }
    }
    const tagsData = tagsArrayData();
    const descriptionString = generateDescString();
    const generatedName = generateCodeNameString(stringText);
    const generatedCode = generateCodeNameString(stringText);
    const payload = {
        active: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        name: generatedName,
        code: generatedCode,
        description: descriptionString.trim(),
        tags: tagsData,
        type: "Media",
        mandatory: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        auto_sync_to_prod: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        media_type: selMediaType,
        allowed_extensions: fileAllowedArray,
        max_size: faker.number.int({ min: 1, max: 10000 }),
        allow_multiple: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        vms_visible: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        vms_editable: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        store_filter: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        store_display_pdp: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        store_display_plp: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        store_search: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        store_compare: booleanStates[Math.floor(Math.random() * booleanStates.length)]
    }
    return payload;
}

export function attributePayloadBasicType(stringText) {
    const tagsData = tagsArrayData();
    const basicTypes = ["HTML", "URL", "Date", "Boolean"]
    const descriptionString = generateDescString();
    const generatedName = generateCodeNameString(stringText);
    const generatedCode = generateCodeNameString(stringText);
    const payload = {
        active: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        name: generatedName,
        code: generatedCode,
        description: descriptionString.trim(),
        tags: tagsData,
        type: basicTypes[Math.floor(Math.random() * basicTypes.length)],
        mandatory: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        auto_sync_to_prod: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        vms_visible: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        vms_editable: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        store_filter: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        store_display_pdp: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        store_display_plp: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        store_search: booleanStates[Math.floor(Math.random() * booleanStates.length)],
        store_compare: booleanStates[Math.floor(Math.random() * booleanStates.length)]
    }
    return payload;
}