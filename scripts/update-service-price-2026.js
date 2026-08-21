import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serverRoot = path.resolve(__dirname, '..');
const projectRoot = path.resolve(serverRoot, '..');

dotenv.config({ path: path.join(serverRoot, '.env') });
dotenv.config();

const options = parseOptions(process.argv.slice(2));
const isApply = options.apply === true;
const confirmToken = 'APPLY_SERVICE_PRICE_2026';

const teenagerDesc = 'Бережное очищение с учётом особенностей подростковой кожи. Чистая и здоровая кожа без травм.';
const diamondDesc = 'Алмазная шлифовка для более гладкой, ровной и свежей кожи.';
const glassDesc = 'THESERA H. Интенсивное увлажнение и восстановление кожи для эффекта наполненной, гладкой и сияющей кожи.';
const collagenDesc = 'THESERA Collagen. Интенсивный anti-age уход, направленный на улучшение плотности, упругости и качества кожи.';
const peptideDesc = 'Пептидное омоложение. Интенсивный уход с пептидами для кожи, которой не хватает упругости, гладкости и свежести.';

const imageCopies = [
    {
        name: 'Glass Skin Therapy',
        source: path.join(projectRoot, 'incoming-price-update', 'IMG_3520 (1).JPG'),
        destination: path.join(serverRoot, 'uploads', 'glass-skin-therapy.jpg'),
        publicPath: '/uploads/glass-skin-therapy.jpg'
    },
    {
        name: 'Collagen Lift',
        source: path.join(projectRoot, 'incoming-price-update', 'IMG_3519 (1).PNG'),
        destination: path.join(serverRoot, 'uploads', 'collagen-lift.png'),
        publicPath: '/uploads/collagen-lift.png'
    },
    {
        name: 'Peptide Rejuvenation',
        source: path.join(projectRoot, 'incoming-price-update', 'IMG_0900 (1).JPEG'),
        destination: path.join(serverRoot, 'uploads', 'peptide-rejuvenation.jpeg'),
        publicPath: '/uploads/peptide-rejuvenation.jpeg'
    }
];

const sourceServiceTimes = {
    'Glass Skin Therapy': '75min',
    'Collagen Lift': '75min',
    'Peptide Rejuvenation': '75min'
};

const newServiceTimes = {
    'Glass Skin Therapy': firstValue(
        sourceServiceTimes['Glass Skin Therapy'],
        options['glass-time'],
        process.env.SERVICE_TIME_GLASS_SKIN_THERAPY,
        process.env.GLASS_SKIN_THERAPY_TIME
    ),
    'Collagen Lift': firstValue(
        sourceServiceTimes['Collagen Lift'],
        options['collagen-time'],
        process.env.SERVICE_TIME_COLLAGEN_LIFT,
        process.env.COLLAGEN_LIFT_TIME
    ),
    'Peptide Rejuvenation': firstValue(
        sourceServiceTimes['Peptide Rejuvenation'],
        options['peptide-time'],
        process.env.SERVICE_TIME_PEPTIDE_REJUVENATION,
        process.env.PEPTIDE_REJUVENATION_TIME
    )
};

const courseByServiceName = new Map([
    ['Пилинг химический', { courseProcedures: 4, coursePrice: '290' }],
    ['Карбокситерапия', { courseProcedures: 4, coursePrice: '290' }],
    ['Массаж лица, шеи и области декольте', { courseProcedures: 5, coursePrice: '300' }],
    ['RF лифтинг', { courseProcedures: 4, coursePrice: '310' }],
    ['Фракционная мезотерапия (микронидлинг)', { courseProcedures: 4, coursePrice: '320' }],
    ['Glass Skin Therapy', { courseProcedures: 4, coursePrice: '320' }],
    ['Collagen Lift', { courseProcedures: 4, coursePrice: '320' }],
    ['ColdPlasma', { courseProcedures: 4, coursePrice: '260' }],
    ['Peptide Rejuvenation', { courseProcedures: 4, coursePrice: '310' }]
].map(([name, fields]) => [normalizeName(name), fields]));

const hiddenPosition = 9000;

const specs = [
    {
        label: 'Консультация',
        kind: 'required',
        matchNames: ['Консультация'],
        desired: (doc) => keep(doc, { price: '30', position: 10, isActive: true })
    },
    {
        label: 'Онлайн-консультация',
        kind: 'required',
        matchNames: ['Онлайн-консультация', 'Онлайн консультация'],
        desired: (doc) => keep(doc, { price: '40', position: 20, isActive: true })
    },
    {
        label: 'Глубокая чистка лица',
        kind: 'required',
        matchNames: ['Глубокая чистка лица'],
        desired: (doc) => keep(doc, { isActive: false, position: hiddenPosition })
    },
    {
        label: 'Ультразвуковая чистка лица',
        kind: 'required',
        matchNames: ['Ультразвуковая чистка лица'],
        desired: (doc) => keep(doc, { price: '70', time: '75min', position: 30, isActive: true })
    },
    {
        label: 'Комбинированная чистка лица',
        kind: 'required',
        matchNames: ['Комбинированная чистка лица'],
        desired: (doc) => keep(doc, { price: '70', position: 40, isActive: true })
    },
    {
        label: 'Глубокая чистка лица для подростков',
        kind: 'upsert',
        matchNames: ['Глубокая чистка лица для подростков'],
        createBase: {
            name: 'Глубокая чистка лица для подростков',
            desc: teenagerDesc,
            img: '/uploads/IMG_6822.JPG',
            price: '60',
            time: '75min',
            position: 50,
            isActive: true
        },
        desired: (doc) => keep(doc, {
            name: 'Глубокая чистка лица для подростков',
            desc: teenagerDesc,
            price: '60',
            time: '75min',
            position: 50,
            isActive: true
        })
    },
    {
        label: 'Уходовые программы',
        kind: 'required',
        matchNames: ['Уходовые программы'],
        desired: (doc) => keep(doc, { price: '70', position: 60, isActive: true })
    },
    {
        label: 'Экспресс-уход для мужчин',
        kind: 'required',
        matchNames: ['Экспресс-уход для мужчин'],
        desired: (doc) => keep(doc, { price: '70', position: 70, isActive: true })
    },
    {
        label: 'Пилинг химический',
        kind: 'required',
        matchNames: ['Пилинг химический'],
        desired: (doc) => keep(doc, { price: '80', position: 80, isActive: true })
    },
    {
        label: 'Карбокситерапия',
        kind: 'required',
        matchNames: ['Карбокситерапия'],
        desired: (doc) => keep(doc, { price: '80', time: '75min', position: 90, isActive: true })
    },
    {
        label: 'Массаж лица, шеи и области декольте',
        kind: 'required',
        matchNames: ['Массаж лица, шеи и области декольте'],
        desired: (doc) => keep(doc, { price: '60', position: 100, isActive: true })
    },
    {
        label: 'RF лифтинг',
        kind: 'required',
        matchNames: ['RF лифтинг'],
        desired: (doc) => keep(doc, { price: '85', time: '75min', position: 110, isActive: true })
    },
    {
        label: 'Фракционная мезотерапия (микронидлинг)',
        kind: 'required',
        matchNames: ['Фракционная мезотерапия (микронидлинг)'],
        desired: (doc) => keep(doc, { price: '90', time: '75min', position: 120, isActive: true })
    },
    {
        label: 'Glass Skin Therapy',
        kind: 'upsert',
        matchNames: ['Glass Skin Therapy'],
        createBase: {
            name: 'Glass Skin Therapy',
            desc: glassDesc,
            img: '/uploads/glass-skin-therapy.jpg',
            price: '90',
            time: newServiceTimes['Glass Skin Therapy'],
            position: 130,
            isActive: true
        },
        desired: (doc) => keep(doc, {
            desc: glassDesc,
            img: '/uploads/glass-skin-therapy.jpg',
            price: '90',
            time: newServiceTimes['Glass Skin Therapy'] || doc.time,
            position: 130,
            isActive: true
        })
    },
    {
        label: 'Collagen Lift',
        kind: 'upsert',
        matchNames: ['Collagen Lift'],
        createBase: {
            name: 'Collagen Lift',
            desc: collagenDesc,
            img: '/uploads/collagen-lift.png',
            price: '90',
            time: newServiceTimes['Collagen Lift'],
            position: 140,
            isActive: true
        },
        desired: (doc) => keep(doc, {
            desc: collagenDesc,
            img: '/uploads/collagen-lift.png',
            price: '90',
            time: newServiceTimes['Collagen Lift'] || doc.time,
            position: 140,
            isActive: true
        })
    },
    {
        label: 'ColdPlasma',
        kind: 'required',
        matchNames: ['ColdPlasma'],
        desired: (doc) => keep(doc, { price: '70', time: '60min', position: 150, isActive: true })
    },
    {
        label: 'Peptide Rejuvenation',
        kind: 'upsert',
        matchNames: ['Peptide Rejuvenation'],
        createBase: {
            name: 'Peptide Rejuvenation',
            desc: peptideDesc,
            img: '/uploads/peptide-rejuvenation.jpeg',
            price: '80',
            time: newServiceTimes['Peptide Rejuvenation'],
            position: 160,
            isActive: true
        },
        desired: (doc) => keep(doc, {
            desc: peptideDesc,
            img: '/uploads/peptide-rejuvenation.jpeg',
            price: '80',
            time: newServiceTimes['Peptide Rejuvenation'] || doc.time,
            position: 160,
            isActive: true
        })
    },
    {
        label: 'Алмазное обновление',
        kind: 'required',
        matchNames: ['Микродермабразия', 'Алмазное обновление'],
        desired: (doc) => keep(doc, {
            name: 'Алмазное обновление',
            desc: diamondDesc,
            price: '70',
            time: '75min',
            position: 170,
            isActive: true
        })
    },
    {
        label: 'Бархатные ручки',
        kind: 'required',
        matchNames: ['Бархатные ручки'],
        desired: (doc) => keep(doc, { isActive: false, position: hiddenPosition + 10 })
    }
];

main().catch(async (error) => {
    console.error('MIGRATION_FAILED', safeError(error));
    try {
        await mongoose.disconnect();
    } catch {
        // no-op
    }
    process.exit(1);
});

async function main() {
    if (!process.env.URL_MONGO) {
        throw new Error('URL_MONGO is not configured');
    }

    if (isApply && options.confirm !== confirmToken) {
        throw new Error(`Apply requires --confirm=${confirmToken}`);
    }

    await mongoose.connect(process.env.URL_MONGO, { serverSelectionTimeoutMS: 10000 });
    const collection = mongoose.connection.db.collection('services');
    const docs = await collection.find({}).sort({ createdAt: 1, _id: 1 }).toArray();

    printCurrentDocs(docs);

    const duplicates = findDuplicates(docs);
    printDuplicates(duplicates);

    const plan = buildPlan(docs);
    printDescriptionCleanupPreview(plan.operations);
    printMissingMatches(plan);
    printPlan(plan.operations);
    printMissingTimes(plan.missingTimes);

    if (plan.errors.length > 0) {
        throw new Error(`Blocking match errors: ${plan.errors.join('; ')}`);
    }

    if (!isApply) {
        console.log('MODE: dry-run. MongoDB writes were not executed.');
        await mongoose.disconnect();
        return;
    }

    if (plan.missingTimes.length > 0) {
        throw new Error(`Missing durations: ${plan.missingTimes.join(', ')}`);
    }

    await ensureTransactionsAvailable();
    await verifySourceImages();
    await copyServiceImages();

    const backupPath = await backupServices(docs);
    console.log(`Backup written: ${path.relative(projectRoot, backupPath)}`);

    const session = await mongoose.startSession();
    const now = new Date();
    try {
        await session.withTransaction(async () => {
            for (const operation of plan.operations) {
                if (operation.action === 'no-op') {
                    continue;
                }

                if (operation.existingDoc) {
                    await collection.updateOne(
                        { _id: operation.existingDoc._id },
                        { $set: { ...operation.desiredDoc, updatedAt: now } },
                        { session }
                    );
                } else {
                    await collection.insertOne(
                        {
                            ...operation.desiredDoc,
                            createdAt: now,
                            updatedAt: now,
                            __v: 0
                        },
                        { session }
                    );
                }
            }
        }, {
            readConcern: { level: 'snapshot' },
            writeConcern: { w: 'majority' }
        });
    } finally {
        await session.endSession();
    }

    const afterDocs = await collection.find({}).sort({ position: 1, createdAt: 1, _id: 1 }).toArray();
    verifyAppliedState(afterDocs, plan.operations);
    console.log('APPLY_COMPLETE: services collection verified after transaction.');
    await mongoose.disconnect();
}

function parseOptions(args) {
    const parsed = {};
    for (const arg of args) {
        if (!arg.startsWith('--')) {
            continue;
        }

        const raw = arg.slice(2);
        const separatorIndex = raw.indexOf('=');
        if (separatorIndex === -1) {
            parsed[raw] = true;
        } else {
            parsed[raw.slice(0, separatorIndex)] = raw.slice(separatorIndex + 1);
        }
    }
    return parsed;
}

function firstValue(...values) {
    return values.find((value) => typeof value === 'string' && value.trim())?.trim() || '';
}

function normalizeName(name) {
    return String(name || '')
        .replace(/\u00a0/g, ' ')
        .replace(/[‐‑‒–—−]/g, '-')
        .trim();
}

function removeLegacyCourseFromDesc(desc) {
    const source = String(desc ?? '');
    if (!/Курс\s+из\s+\d+\s+процедур/iu.test(source)) {
        return source;
    }

    let cleaned = source
        .replace(/\([^()]*Курс\s+из\s+\d+\s+процедур[^()]*\)\s*(?:[=—-]\s*\d+\s*€\)?)?/giu, ' ')
        .replace(/(^|[\s—-]+)Курс\s+из\s+\d+\s+процедур(?:\s*[=—-]\s*\d+\s*€)?\)?/giu, (match, prefix) => {
            return /^\s+$/.test(prefix) ? ' ' : '';
        });

    cleaned = cleaned
        .replace(/\(\s*\)/g, ' ')
        .replace(/\s+=\s*(?:\d+\s*€\)?)?/g, ' ')
        .replace(/^[\s=—-]+/g, '')
        .replace(/[\s=—-]+$/g, '')
        .replace(/\s+([.,;:!?])/g, '$1')
        .replace(/\s{2,}/g, ' ')
        .trim();

    return /^[()=\s—-]*$/.test(cleaned) ? '' : cleaned;
}

function keep(doc, changes) {
    return {
        name: doc.name,
        desc: doc.desc ?? '',
        img: doc.img,
        price: doc.price,
        time: doc.time,
        courseProcedures: doc.courseProcedures ?? null,
        coursePrice: doc.coursePrice ?? '',
        position: doc.position ?? 1000,
        isActive: doc.isActive ?? true,
        ...changes
    };
}

function applyCourseFields(doc) {
    return {
        ...doc,
        ...courseFieldsFor(doc.name)
    };
}

function applyDescriptionCleanup(doc) {
    return {
        ...doc,
        desc: removeLegacyCourseFromDesc(doc.desc)
    };
}

function courseFieldsFor(name) {
    return courseByServiceName.get(normalizeName(name)) || {
        courseProcedures: null,
        coursePrice: ''
    };
}

function buildPlan(docs) {
    const operations = [];
    const missingMatches = [];
    const missingTimes = [];
    const errors = [];

    for (const spec of specs) {
        const matches = findMatches(docs, spec.matchNames);

        if (matches.length > 1) {
            errors.push(`${spec.label}: found ${matches.length} matches`);
            continue;
        }

        if (matches.length === 0 && spec.kind === 'required') {
            missingMatches.push(spec.label);
            errors.push(`${spec.label}: found 0 matches`);
            continue;
        }

        const existingDoc = matches[0] || null;
        const desiredDoc = applyDescriptionCleanup(
            applyCourseFields(existingDoc ? spec.desired(existingDoc) : { ...spec.createBase })
        );

        if (!desiredDoc.time) {
            missingTimes.push(desiredDoc.name);
        }

        operations.push({
            spec,
            existingDoc,
            desiredDoc,
            action: getAction(existingDoc, desiredDoc)
        });
    }

    return { operations, missingMatches, missingTimes, errors };
}

function findMatches(docs, matchNames) {
    const targets = new Set(matchNames.map(normalizeName));
    return docs.filter((doc) => targets.has(normalizeName(doc.name)));
}

function findDuplicates(docs) {
    const grouped = new Map();
    for (const doc of docs) {
        const key = normalizeName(doc.name);
        const group = grouped.get(key) || [];
        group.push(doc);
        grouped.set(key, group);
    }

    return [...grouped.entries()]
        .filter(([, group]) => group.length > 1)
        .map(([normalizedName, group]) => ({
            normalizedName,
            names: group.map((doc) => doc.name)
        }));
}

function getAction(existingDoc, desiredDoc) {
    if (!existingDoc) {
        return 'create';
    }

    const changedFields = getChangedFields(existingDoc, desiredDoc);
    const hasChanges = changedFields.length > 0;

    if (!hasChanges) {
        return 'no-op';
    }

    if (changedFields.includes('isActive') && desiredDoc.isActive === false) {
        return 'hide';
    }

    if (changedFields.includes('name')) {
        return 'rename/update';
    }

    return 'update';
}

function getChangedFields(existingDoc, desiredDoc) {
    if (!existingDoc) {
        return ['create'];
    }

    const fields = ['name', 'desc', 'img', 'price', 'time', 'courseProcedures', 'coursePrice', 'position', 'isActive'];
    return fields.filter((field) => !valuesEqual(field, existingDoc[field], desiredDoc[field]));
}

function valuesEqual(field, before, after) {
    if (field === 'courseProcedures' || field === 'coursePrice') {
        return normalizeExact(before) === normalizeExact(after);
    }

    return normalizeComparable(before) === normalizeComparable(after);
}

function normalizeComparable(value) {
    return value === undefined ? '' : String(value);
}

function normalizeExact(value) {
    if (value === undefined) {
        return '[missing]';
    }

    if (value === null) {
        return 'null';
    }

    return String(value);
}

function formatValue(value) {
    if (value === undefined) {
        return '[missing]';
    }

    if (value === null) {
        return 'null';
    }

    return value;
}

function printCurrentDocs(docs) {
    console.log('CURRENT SERVICES');
    console.table(docs.map((doc, index) => ({
        '#': index + 1,
        id: String(doc._id),
        name: doc.name,
        price: doc.price,
        time: doc.time,
        courseProcedures: formatValue(doc.courseProcedures),
        coursePrice: formatValue(doc.coursePrice),
        isActive: doc.isActive ?? true,
        position: doc.position ?? ''
    })));
}

function printDescriptionCleanupPreview(operations) {
    console.log('DESCRIPTION CLEANUP PREVIEW');
    console.table(operations.map((operation) => {
        const before = operation.existingDoc || {};
        const after = operation.desiredDoc;

        return {
            name: after.name,
            descBefore: before.desc ?? '',
            descAfter: after.desc ?? '',
            courseProcedures: formatValue(after.courseProcedures),
            coursePrice: formatValue(after.coursePrice)
        };
    }));
}

function printDuplicates(duplicates) {
    console.log('POSSIBLE DUPLICATES');
    if (duplicates.length === 0) {
        console.log('none');
        return;
    }

    console.table(duplicates);
}

function printMissingMatches(plan) {
    const missingForCreate = plan.operations
        .filter((operation) => !operation.existingDoc)
        .map((operation) => operation.desiredDoc.name);

    console.log('ABSENT MATCHES');
    console.table([
        ...plan.missingMatches.map((name) => ({ type: 'blocking-missing-existing', name })),
        ...missingForCreate.map((name) => ({ type: 'will-create-or-require-time', name }))
    ]);
}

function printPlan(operations) {
    console.log('CHANGE PLAN');
    console.table(operations.map((operation) => {
        const before = operation.existingDoc || {};
        const after = operation.desiredDoc;

        return {
            action: operation.action,
            changedFields: getChangedFields(operation.existingDoc, operation.desiredDoc).join(', '),
            nameBefore: before.name || '',
            nameAfter: after.name,
            priceBefore: before.price || '',
            priceAfter: after.price,
            timeBefore: before.time || '',
            timeAfter: after.time || '[MISSING]',
            courseProcedures: `${formatValue(before.courseProcedures)} -> ${formatValue(after.courseProcedures)}`,
            coursePrice: `${formatValue(before.coursePrice)} -> ${formatValue(after.coursePrice)}`,
            isActive: `${before.isActive ?? ''} -> ${after.isActive}`,
            position: `${before.position ?? ''} -> ${after.position}`
        };
    }));
}

function printMissingTimes(missingTimes) {
    console.log('MISSING DURATIONS');
    if (missingTimes.length === 0) {
        console.log('none');
        return;
    }

    console.table(missingTimes.map((name) => ({ name })));
    console.log('Provide them with --glass-time, --collagen-time, --peptide-time or SERVICE_TIME_* env vars before apply.');
}

async function verifySourceImages() {
    const missing = [];
    for (const image of imageCopies) {
        if (!await exists(image.source)) {
            missing.push(`${image.name}: missing source image`);
        }
    }

    if (missing.length > 0) {
        throw new Error(missing.join('; '));
    }
}

async function copyServiceImages() {
    await fs.mkdir(path.join(serverRoot, 'uploads'), { recursive: true });
    for (const image of imageCopies) {
        await fs.copyFile(image.source, image.destination);
    }
}

async function ensureTransactionsAvailable() {
    const hello = await mongoose.connection.db.admin().command({ hello: 1 });
    const isReplicaSet = Boolean(hello.setName);
    const isSharded = hello.msg === 'isdbgrid';

    if (!isReplicaSet && !isSharded) {
        throw new Error('MongoDB transactions are not available on this deployment');
    }
}

async function backupServices(docs) {
    const backupDir = path.join(serverRoot, 'backups');
    await fs.mkdir(backupDir, { recursive: true });
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(backupDir, `services-${timestamp}.json`);
    await fs.writeFile(backupPath, `${JSON.stringify(docs, null, 2)}\n`, 'utf8');
    return backupPath;
}

function verifyAppliedState(docs, operations) {
    for (const operation of operations) {
        const matches = findMatches(docs, [operation.desiredDoc.name]);
        if (matches.length !== 1) {
            throw new Error(`${operation.desiredDoc.name}: expected 1 document after apply, found ${matches.length}`);
        }

        const doc = matches[0];
        const fields = ['name', 'desc', 'img', 'price', 'time', 'courseProcedures', 'coursePrice', 'position', 'isActive'];
        for (const field of fields) {
            if (!valuesEqual(field, doc[field], operation.desiredDoc[field])) {
                throw new Error(`${operation.desiredDoc.name}: ${field} verification failed`);
            }
        }
    }

    const activeNames = docs
        .filter((doc) => doc.isActive !== false)
        .map((doc) => normalizeName(doc.name));

    for (const hiddenName of ['Глубокая чистка лица', 'Бархатные ручки']) {
        if (activeNames.includes(normalizeName(hiddenName))) {
            throw new Error(`${hiddenName}: hidden service is still active`);
        }
    }
}

async function exists(filePath) {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}

function safeError(error) {
    const message = error.message || 'unknown error';
    if (/mongodb|mongo|querysrv|econnrefused|enotfound|timed out|server selection/i.test(message)) {
        return `${error.name || 'Error'}: MongoDB connection failed`;
    }

    return `${error.name || 'Error'}: ${message}`;
}
