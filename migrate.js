import { db } from './firebase-init.js';
import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const initialProducts = [
    { name: 'Fraise Hélicoïdale Up-Down', price: 48.50, category: 'Wood', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVZcvqF2YTYqQLFFrAmtiyhULDKfPctJ652M0kdRSuzhEL_sxPg9CYP9clB_3bmo4tfZXHLYZHGhg4m3iDqOHoe7FxtDYVsTnD_wGdoxNT51rGNwrFlsUZukXf80HSYd07Oeg1b9f-VmkAKjEOv-x1QRKfB79HsoeswWl1jMV1qb786d8gbAI1_4MHbjzYG8Qc7cmgXrEOPObqF1kxxZk7wXXI1zQZxKq27RKVBd6aB4wJ604FxVKDM49sWvW6Cot1-Kg4f2NzOQ', description: 'Solid carbide 3-flute end mill tool for high precision milling.' },
    { name: 'Fraise 1 Dent Polie Alu', price: 32.20, category: 'Aluminium', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAq6msvHT-b74N7xP7WvsJHpJ1pAkcrhG9LRXfqWY6oxOkRjVZPPwKLQOYS-hSSBg2_jgNYkNig0n7whnyUlHG2wrSn55CAV0vUdIq0LcT9rxIeN-6muS0o0PTBBN2rESOXL1M0VCEaFCSQVUqtvKfAAIiTWGBdHy_CEB-18ujf0lNJasv1j_mDNOK4tRpB3HdTmKPEkmsThwhNWDlob8WGW0MGU2Gxx7EK01tuA5YZhsa7LC82mcL_6jM_J2gC82fVxxfOqKH3FQ', description: 'Aluminum cutting CNC bit with high reflection and edge durability.' },
    { name: 'Fraise à Surfaçer à Plaquettes', price: 125.00, category: 'Carbide', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVAH_ucKmxqiHxWKrFdz7Ej96uykcr64SbB1wkTR-HVUzjYY4eYouXgpzjpcsOKthwQiK8RVCc26b2kQEqrJChAiv14AoU9HH0DnaQSA_lfmelWM6cRYYhHYLWfdUDpTGMKT-sN4NjqONI-IvT3FDnIHlaEMj_Msvr2btIDJSl3MWA5of_ui37jQRBXtHQ633uwQ4aAjl8xXM9WpBsm_F-eHzbxCoo5QRPc923vpqBsPRv9975hquw-dANKutSa0w6swI-KG8TFQ', description: 'Industrial surfacing tool for large material removal.' },
    { name: 'Fraise Diamant PCD', price: 210.00, category: 'Diamond', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCot4BDKF1pV0UhmcscGuD3cBwSwQP-GbzfkeL5lmDJoP3nHIJxEp1-XTsypsabSfJ3UZYyaOAKYFyZsj2K-kN_jIghiGn4I-O9KqtWlc9PUW5hx4ePAHhtcpfRoTlgNj3RRYgqlMrwJcJN5E9iDWXKE8jx08KzCEWyywr81QNbd0IL8kf1doEsQeq6_10B139LcTtY7V0ebHXMH4mhVzg7yXiF-r6cTfEr1gO0SIAsHTVk9z4-F49BbW3URrRxLuHVwCVNBQGO7w', description: 'Extreme longevity diamond router bit for composite materials.' },
    { name: 'Fraise spirale à coupe montante', price: 25.00, category: 'Wood', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDXJOFtcikiZRXsKlE3yEtfoyskwSRANyYmByW_mdyPn4CH27ZhK_SJ-O1s85hRJSUu0BZuRQBBYHL9NFDTy2bhFQsghAOClUbU07V03_NI47YGwuIPLwQCavNvf4gXdymEvIP4sc2zfQuB1rj_SPaXEuV0AK9znHUOUa5LS0PyfrhHmDRyjgEUgDHvs8xDjLBOhs52sgTbETquPMeAZRIQMQVG7lGwCZAlAgINVhCOgZ8r7ghMIwo3sGodX2pgrbkiwzJhk-ETA', description: 'Single-flute spiral for efficient chip evacuation.' },
    { name: 'Fraise de gravure en V', price: 18.00, category: 'Wood', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBVx-4xn1hnkFd1kXwKo-WWRpP39K5l4zvjvx3IUFD3LfhS3CUaA1ijCivQAx3TNR00AZIREUzfYBDIhpo8ZkfIX8VA05iVP1BN_C-Wnshouo4aSDxC_IfPyGVipe_bdR5-QrEmXnH__4vuXXCtdVunJGyzdv5pK6LMmx236KFDiV-f6fFwXDTMard8qu1yUtnAG_ih3jYH_Z__jjT_V6h3yLri2-xH1pwMx5da4VCAFdmUOZpSapwVKz586TTuvr_uC1ax1zIGQ', description: 'Precision V-bit for detailing and sign making.' },
    { name: 'Fraise compression spirale', price: 45.00, category: 'Wood', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJ8ZyHr4x9znp4Mgyo7AbnBpFmGO55oscHI4zlCb8plSy5SFI_kCA-2ygT9PgLimA7UtlNdZtYf5K-hcG01XcCKabL53e39CD_cXdcFKkGVJpGGGJ4srDqLxW3dlROGzqJMoTsZ0ZBIj9a8I46NQuBmUOSPZKUy6Gv7mOZwV5Adca0Cg02jovU-YNnpLuGPjDVtNfX4wIkXDNF-vLCyGz3umk2SaWeCCQ9P5SGDkZ-LzMjxCwPI0FSw2YqfqXbeRKifbspC8BS-w', description: 'Up-down geometry to prevent breakout on laminates.' }
];

async function migrate() {
    console.log("Starting migration...");
    const productsCollection = collection(db, 'products');
    
    // Check if empty
    const snapshot = await getDocs(productsCollection);
    if (!snapshot.empty) {
        console.log("Database not empty. Migration skipped.");
        return;
    }

    for (const prod of initialProducts) {
        await addDoc(productsCollection, {
            ...prod,
            createdAt: new Date().toISOString()
        });
        console.log(`Migrated: ${prod.name}`);
    }
    console.log("Migration complete!");
}

migrate();
