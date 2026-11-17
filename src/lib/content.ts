import { z } from "zod";

import { CITY_COORDS, places } from "@/components/indiaStatesData";
import heroImage from "@/assets/hero image.jpeg";
import ryaLogo from "@/assets/rya-logo.png";
import mahaveerLogo from "@/assets/mahaveer-logo.png";
import sankaraLogo from "@/assets/sankara-logo.png";
import lionsLogo from "@/assets/lions-logo.png";
import jainLogo from "@/assets/jain-logo.png";
import vesLogo from "@/assets/ves-logo.png";
import adinathLogo from "@/assets/adinath-logo.png";
import rmdCareTrustLogo from "@/assets/rmd-care-trust-logo.jpeg";
import sevaBharathiLogo from "@/assets/seva-bharathi-logo.jpeg";
import chennaiMetroMahaveerLogo from "@/assets/chennai-metro-mahaveer-logo.jpeg";
import rajasthaniAssociationTnLogo from "@/assets/rajasthani-association-tn-logo.png";
import annualScholarshipCeremonyChennaiImg from "@/assets/gallery-annual-scholarship-ceremony-chennai.jpeg";
import awardedRajasthanShreeImg from "@/assets/gallery-awarded-rajasthan-shree-rajasthan-sangh-chennai.jpeg";
import cataractSurgeryChennaiMetroMahaveerImg from "@/assets/gallery-cataract-surgery-chennai-metro-mahaveer.jpeg";
import cataractSurgeryFollowUpImg from "@/assets/gallery-cataract-surgery-follow-up.jpeg";
import chaaraGodownNagaurImg from "@/assets/gallery-chaara-godown-nagaur.jpeg";
import chaaraGodownNagaurPreviewImg from "@/assets/Chaara Godown Nagaur Preview.jpg";
import foodDistributionDriveAkshayaTrustImg from "@/assets/gallery-food-distribution-drive-akshaya-trust.jpeg";
import foodDistributionDriveNewImg from "@/assets/gallery-food-distribution-drive-new.jpeg";
import foodDistributionDriveImg from "@/assets/gallery-food-distribution-drive.jpeg";
import foodDistributionImg from "@/assets/gallery-food-distribution.jpeg";
import freeEyeScreeningCampChennaiImg from "@/assets/gallery-free-eye-screening-camp-chennai.jpeg";
import hallDonatedMarudharMertaCityImg from "@/assets/gallery-hall-donated-marudhar-merta-city.jpeg";
import khwaspuraGaushalaShedImg from "@/assets/gallery-khwaspura-gaushala-shed.jpeg";
import maternityWardInaugurationImg from "@/assets/gallery-maternity-ward-inauguration.jpeg";
import maternityWardInaugurationPreviewImg from "@/assets/Maternity Ward Inauguration Preview.jpg";
import mouSewaBhartiMultiSpecialtyHospitalImg from "@/assets/gallery-mou-sewa-bharti-multi-specialty-hospital.jpeg";
import mouSewaBhartiMultiSpecialtyHospitalPreviewImg from "@/assets/MoU Sewa Bharti Multi Specialty Hospital Preview.jpg";
import newbornCareUnitImg from "@/assets/gallery-newborn-care-unit.jpeg";
import newbornCareUnitPreviewImg from "@/assets/Newborn Care Unit Preview.jpg";
import prostheticsDistributionAdinathJainTrustImg from "@/assets/gallery-prosthetics-distribution-adinath-jain-trust-chennai.jpeg";
import prostheticsDistributionImg from "@/assets/gallery-prosthetics-distribution.jpeg";
import roomDonationDharamshalaLodgingImg from "@/assets/gallery-room-donation-dharamshala-lodging.jpeg";
import sankaraEyeHospitalBlockImg from "@/assets/gallery-sankara-eye-hospital-block.jpeg";
import tenthScholarshipDistributionImg from "@/assets/gallery-10th-scholarship-distribution-ceremony.jpeg";
import tenthScholarshipDistributionPreviewImg from "@/assets/10th Scholarship Distribution Ceremony Preview.jpg";
import eleventhScholarshipDistributionImg from "@/assets/gallery-11th-scholarship-distribution-ceremony.jpeg";
import thirteenthScholarshipDistributionImg from "@/assets/gallery-13th-scholarship-distribution-439-students.jpeg";
import twentyTwoLakhScholarshipDistributionImg from "@/assets/gallery-22-lakh-scholarship-distribution-ceremony.jpeg";
import twentyTwoLakhScholarshipDistributionPreviewImg from "@/assets/22 Lakh Scholarship Distribution Ceremony Preview.jpg";
import inaugurationVivekanandaVidyalayaImg from "@/assets/gallery-inauguration-vivekananda-vidyalaya.jpeg";
import inaugurationVivekanandaVidyalayaPreviewImg from "@/assets/Inauguration Vivekananda Vidyalaya Preview.jpg";
import maternityChildCareHomeHandoverImg from "@/assets/gallery-maternity-child-care-home-handover.jpeg";
import maternityChildCareHomeHandoverPreviewImg from "@/assets/Maternity And Child Care Home Handover Preview.jpg";
import maternityHomePlaquePresentationImg from "@/assets/gallery-maternity-home-plaque-presentation.jpeg";
import maternityHospitalImg from "@/assets/gallery-maternity-hospital.jpeg";
import vivekanandaVidyalayaImg from "@/assets/gallery-vivekananda-vidyalaya.jpeg";
import multispecialityHospitalBhoomiPoojaImg from "@/assets/Multispeciality Hospital Bhoomi Pooja.jpeg";
import bhoomiPoojaCeremonyVivekanandaImg from "@/assets/Bhoomi Pooja Ceremony Vivekananda Vidhyalaya.jpeg";
import bhoomiPoojaCeremonyHospitalImg from "@/assets/Bhoomi Pooja Cermony Multi-speciality Hospital.jpeg";
import bhoomiPoojaCancerHospitalGoonipalayamImg from "@/assets/Bhoomi Pooja Cancer Hospital Goonipalayam.jpg";
import bhoomiPoojaCancerHospitalGoonipalayamPreviewImg from "@/assets/Bhoomi Pooja Cancer Hospital Goonipalayam Preview.jpg";
import cancerHospitalGoonipalayamPressImg from "@/assets/Cancer and Palliative Care Hospital Goonipalayam Press Coverage.jpg";
import cancerHospitalGoonipalayamPressPreviewImg from "@/assets/Cancer and Palliative Care Hospital Goonipalayam Press Coverage Preview.jpg";
import sambhavnathJainMandirPrathisthaImg from "@/assets/Shri Sambhavnath Jain Mandir Prathistha Mahamahotsav.jpg";
import cattleFeedingGaushalaImg from "@/assets/Cattle Feeding in Gaushala.jpeg";
import mangilalChandjiTaterImg from "@/assets/founder-mangilal-chandji-tater.jpeg";
import sohanKanwarTaterImg from "@/assets/founder-sohan-kanwar-tater.jpeg";
import mangalChandTaterImg from "@/assets/founder-mangal-chand-tater.jpeg";
import sureshChandTaterImg from "@/assets/trustee-suresh-chand-tater.jpeg";
import padamChandTaterImg from "@/assets/trustee-padam-chand-tater.jpeg";
import kamalChandTaterImg from "@/assets/trustee-kamal-chand-tater.jpeg";
import dineshChandTaterImg from "@/assets/trustee-dinesh-chand-tater.jpeg";
import arihantTaterImg from "@/assets/trustee-arihant-tater.jpeg";
import praveshTaterImg from "@/assets/trustee-pravesh-tater.jpeg";

// Everything an admin can edit. Each section has a schema (validates saves on
// the server) and a default (shown until something is saved for that section).

/* ── Schemas ── */

const id = z.string().min(1).max(64);
const text = (max: number) =>
  z.string().trim().max(max, `Keep it under ${max} characters`);
const required = (what: string, max: number) =>
  text(max).min(1, `Please fill in every ${what}`);
// Bundled assets are root-relative ("/assets/…"); uploads are https:// Blob URLs.
const imgUrl = z
  .string()
  .max(2000)
  .refine(
    (s) => s.startsWith("/") || s.startsWith("https://"),
    "Please add a photo to every item",
  );

export const WORK_CATS = [
  "Education",
  "Healthcare",
  "Community",
  "Animal",
] as const;
export const GALLERY_CATS = [
  "Education",
  "Healthcare",
  "Community",
  "Animal Welfare",
] as const;
export const TIMELINE_ICONS = [
  "Landmark",
  "ArrowUpRight",
  "GraduationCap",
  "Stethoscope",
  "HandHeart",
  "Heart",
  "Users",
  "PawPrint",
  "Eye",
  "Building2",
] as const;

export const impactFields = [
  { id: "students", label: "Students awarded scholarships" },
  {
    id: "scholarshipAmount",
    label: "Scholarship amount disbursed",
    prefix: "₹",
    format: "inr" as const,
  },
  { id: "babies", label: "Babies delivered at Trust's hospital in Merta" },
  { id: "eyeScreenings", label: "Eye camp screenings" },
  { id: "eyeSurgeries", label: "Eye surgeries" },
  { id: "spectacles", label: "Spectacles distributed" },
  { id: "eyeCamps", label: "Eye camps conducted" },
  { id: "disabled", label: "Disabled people benefited", suffix: "+" },
  { id: "dialysis", label: "Dialysis machines donated" },
] as {
  id: string;
  label: string;
  prefix?: string;
  suffix?: string;
  format?: "inr";
}[];

export const schemas = {
  impact: z.record(z.string().max(64), z.number().int().min(0).max(1e12)),
  contact: z.object({
    address: text(300),
    phone: text(40),
    email: text(120),
    hours: text(120),
  }),
  bank: z.object({
    accountName: text(150),
    bankName: text(100),
    accountNumber: text(40),
    ifsc: text(20),
  }),
  hero: z.object({ img: imgUrl }),
  founders: z
    .array(
      z.object({
        id,
        name: required("name", 100),
        years: text(60),
        img: imgUrl,
      }),
    )
    .max(50),
  trustees: z
    .array(z.object({ id, name: required("name", 100), img: imgUrl }))
    .max(100),
  work: z
    .array(
      z.object({
        id,
        cat: z.enum(WORK_CATS),
        name: required("programme name", 150),
        location: text(150),
        impact: text(80),
        desc: text(500),
      }),
    )
    .max(300),
  timeline: z
    .array(
      z.object({
        id,
        year: required("year", 20),
        title: required("title", 150),
        text: text(600),
        icon: z.enum(TIMELINE_ICONS),
        stats: z.array(text(120)).max(10),
      }),
    )
    .max(100),
  reach: z
    .array(
      z.object({
        id,
        state: required("state name", 60),
        cities: z
          .array(
            z.object({
              name: required("city name", 60),
              x: z.number().min(0).max(460),
              y: z.number().min(0).max(520),
            }),
          )
          .max(60),
      }),
    )
    .max(40),
  partners: z
    .array(
      z.object({
        id,
        name: required("partner name", 150),
        logo: imgUrl.optional(),
      }),
    )
    .max(100),
  gallery: z
    .array(
      z.object({
        id,
        cat: z.enum(GALLERY_CATS),
        caption: required("caption", 200),
        // width / height of the image shown in the grid (previewImg if set), so
        // cards keep the photo's exact shape.
        ratio: z.number().min(0.05).max(20),
        img: imgUrl,
        // Grid thumbnail when the full img (e.g. a newspaper page) crops badly.
        previewImg: imgUrl.optional(),
        hideFromAll: z.boolean().optional(),
      }),
    )
    .max(1000),
};

export type SectionId = keyof typeof schemas;
export type Content = { [K in SectionId]: z.infer<(typeof schemas)[K]> };
export const SECTION_IDS = Object.keys(schemas) as SectionId[];

/* ── Roles ── */

export const ROLES = {
  super: {
    label: "Super Admin",
    sections: SECTION_IDS,
    imagesOnly: [] as SectionId[],
  },
  akshit: {
    label: "Akshit Tater",
    sections: ["gallery"] as SectionId[],
    imagesOnly: [] as SectionId[],
  },
  developer: {
    label: "Developer",
    sections: [
      "hero",
      "gallery",
      "founders",
      "trustees",
      "partners",
    ] as SectionId[],
    // Can swap photos in these, but not change text or add/remove items.
    imagesOnly: ["founders", "trustees", "partners"] as SectionId[],
  },
};
export type Role = keyof typeof ROLES;
export const ROLE_IDS = Object.keys(ROLES) as Role[];

const IMAGE_KEYS = new Set(["img", "previewImg", "logo", "ratio"]);
// Same data with every photo field blanked: equal before/after ⇒ only photos changed.
export function withoutImages(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(withoutImages);
  if (v && typeof v === "object")
    return Object.fromEntries(
      Object.entries(v)
        .filter(([k]) => !IMAGE_KEYS.has(k))
        .map(([k, x]) => [k, withoutImages(x)]),
    );
  return v;
}

/* ── Defaults (the site as it was before the admin panel) ── */

export const defaults: Content = {
  impact: {
    students: 4820,
    scholarshipAmount: 19766858,
    babies: 6360,
    eyeScreenings: 166011,
    eyeSurgeries: 50448,
    spectacles: 14339,
    eyeCamps: 1307,
    disabled: 2000,
    dialysis: 2,
  },
  contact: {
    address: "No 52, Maddox Street, 1st Floor, Vepery, Chennai 600007",
    phone: "+91 98419 11058",
    email: "smtaterctrust@gmail.com",
    hours: "Mon - Sat · 10:00 AM – 6:00 PM",
  },
  bank: {
    accountName: "Sohan Kanwar Mangilal Tater Charitable Trust",
    bankName: "RBL Bank",
    accountNumber: "309841435214",
    ifsc: "RATN0000187",
  },
  hero: { img: heroImage },
  founders: [
    {
      id: "f1",
      name: "Mangilal Chandji Tater",
      years: "1933 – 2011",
      img: mangilalChandjiTaterImg,
    },
    {
      id: "f2",
      name: "Sohan Kanwar Tater",
      years: "1936 – 2017",
      img: sohanKanwarTaterImg,
    },
    {
      id: "f3",
      name: "Mangal Chand Tater",
      years: "1955 – 2025",
      img: mangalChandTaterImg,
    },
  ],
  trustees: [
    { id: "t1", name: "Suresh Chand Tater", img: sureshChandTaterImg },
    { id: "t2", name: "Padam Chand Tater", img: padamChandTaterImg },
    { id: "t3", name: "Kamal Chand Tater", img: kamalChandTaterImg },
    { id: "t4", name: "Dinesh Chand Tater", img: dineshChandTaterImg },
    { id: "t5", name: "Arihant Tater", img: arihantTaterImg },
    { id: "t6", name: "Pravesh Tater", img: praveshTaterImg },
  ],
  work: [
    {
      id: "w1",
      cat: "Education" as const,
      name: "Scholarship Programme",
      location: "Pan - India",
      impact: "4,820 Students",
      desc: "Annual merit & need-based scholarships.",
    },
    {
      id: "w2",
      cat: "Education" as const,
      name: "Vivekananda Education Society",
      location: "Chennai",
      impact: "Classroom Donation",
      desc: "Infrastructure for holistic learning.",
    },
    {
      id: "w3",
      cat: "Education" as const,
      name: "Jain Sohan Kanwar Mangilal Tater Vivekananda Vidhyalaya",
      location: "Uttukottai, Tamil Nadu",
      impact: "Future Campus",
      desc: "4.36 Acres of Land donated for a school.",
    },
    {
      id: "w4",
      cat: "Education" as const,
      name: "Rajasthan Education Trust",
      location: "Rajasthan",
      impact: "Regional Education",
      desc: "Multi-year support to regional education.",
    },
    {
      id: "w5",
      cat: "Education" as const,
      name: "Mahaveer Rajasthani Intl. School",
      location: "Chennai",
      impact: "Diamond Donor",
      desc: "Multi-year institutional partnership.",
    },
    {
      id: "w6",
      cat: "Healthcare" as const,
      name: "Maternity Hospital",
      location: "Merta city, Rajasthan",
      impact: "6,360 Deliveries",
      desc: "Safe maternity care for underserved families.",
    },
    {
      id: "w7",
      cat: "Healthcare" as const,
      name: "Eye Camps",
      location: "Tamil nadu and Andhra pradesh",
      impact: "1,66,011 Screenings",
      desc: "Free screenings reaching remote communities.",
    },
    {
      id: "w8",
      cat: "Healthcare" as const,
      name: "Lions Eye Bank OMNI Van",
      location: "Lions Eye Bank, Egmore, Chennai",
      impact: "Mobile Care",
      desc: "An Omni ambulance donated for mobile eye care to villages and to facilitate eye and organ collection.",
    },
    {
      id: "w9",
      cat: "Healthcare" as const,
      name: "Dialysis Machines",
      location: "RYA Hospital, chennai",
      impact: "2 Machines",
      desc: "Ongoing kidney care infrastructure.",
    },
    {
      id: "w10",
      cat: "Healthcare" as const,
      name: "Sankara Eye Hospital Block",
      location: "Chennai",
      impact: "Block Donation",
      desc: "Dedicated patient care block.",
    },
    {
      id: "w11",
      cat: "Healthcare" as const,
      name: "Limb Camps",
      location: "Multi-region",
      impact: "2000+ Beneficiaries",
      desc: "Prosthetic limbs for the differently-abled.",
    },
    {
      id: "w12",
      cat: "Healthcare" as const,
      name: "Jain Mission Trust OPD",
      location: "Chikkaballapur, Karnataka",
      impact: "OPD Room",
      desc: "Outpatient care infrastructure.",
    },
    {
      id: "w13",
      cat: "Healthcare" as const,
      name: "Hospital & Medical Facility Support",
      location: "Jain Mission Trust Hospital, Bangalore",
      impact: "OPD Room Donation",
      desc: "Donation of an OPD room to support outpatient care.",
    },
    {
      id: "w14",
      cat: "Healthcare" as const,
      name: "Cancer Care",
      location: "RYA Madras Cosmo Foundation",
      impact: "Cancer Detection Centre",
      desc: "Support towards the Cancer Detection Centre.",
    },
    {
      id: "w15",
      cat: "Community" as const,
      name: "Blanket Distribution",
      location: "Annual",
      impact: "Winter relief",
      desc: "Warmth for those without shelter.",
    },
    {
      id: "w16",
      cat: "Community" as const,
      name: "Food Distribution",
      location: "Year-round",
      impact: "Daily meals",
      desc: "Nutrition support in slums and rural areas.",
    },
    {
      id: "w17",
      cat: "Community" as const,
      name: "Sadharmik Family Support",
      location: "Community",
      impact: "Ongoing",
      desc: "Quiet support to families in need.",
    },
    {
      id: "w18",
      cat: "Community" as const,
      name: "Flat Donation",
      location: "Chennai",
      impact: "Housing",
      desc: "Residential support for deserving families.",
    },
    {
      id: "w19",
      cat: "Community" as const,
      name: "Dharamshala Room",
      location: "Rajasthan & Gujrat",
      impact: "Lodging",
      desc: "Dharamshala Rooms Donatated.",
    },
    {
      id: "w20",
      cat: "Community" as const,
      name: "Butati Dham Dharamshala",
      location: "Butati Dham",
      impact: "Dharamshala Room",
      desc: "A dharamshala room donated to support pilgrims and visitors.",
    },
    {
      id: "w21",
      cat: "Community" as const,
      name: "Environmental Initiative",
      location: "Pan - India",
      impact: "1,000 Saplings",
      desc: "1,000 saplings planted as part of the Trust's environmental efforts.",
    },
    {
      id: "w22",
      cat: "Community" as const,
      name: "Natural Disaster Relief",
      location: "Tamil Nadu",
      impact: "Emergency Relief",
      desc: "Relief provided to people affected by COVID-19 and the Tamil Nadu tsunami.",
    },
    {
      id: "w23",
      cat: "Community" as const,
      name: "Kapeda Dwar Construction",
      location: "Kapeda, Rajasthan",
      impact: "Heritage",
      desc: "Community gateway construction.",
    },
    {
      id: "w24",
      cat: "Animal" as const,
      name: "Khwaspura Gaushala Shed",
      location: "Khwaspura, Rajasthan",
      impact: "Cattle Shelter",
      desc: "Built shelter for rescued cattle.",
    },
    {
      id: "w25",
      cat: "Animal" as const,
      name: "Lambiya Gaushala Shed",
      location: "Lambiya, rajasthan",
      impact: "Cattle Shelter",
      desc: "Additional shelter for the herd.",
    },
    {
      id: "w26",
      cat: "Animal" as const,
      name: "Continuous Gaushala Support",
      location: "Pan - India",
      impact: "Ongoing",
      desc: "Recurring care, feed and maintenance.",
    },
    {
      id: "w27",
      cat: "Animal" as const,
      name: "Adinath Jain Trust",
      location: "Rajasthan",
      impact: "Animal Welfare",
      desc: "Long-term support for animal welfare.",
    },
    {
      id: "w28",
      cat: "Animal" as const,
      name: "Cow Shelter and Feeding",
      location: "Rajasthan",
      impact: "7 Cow Sheds",
      desc: "A total of seven cow sheds donated across Rajasthan.",
    },
  ],
  timeline: [
    {
      id: "y1",
      year: "2011",
      title: "Trust Established",
      text: "Sohan Kanwar Mangilal Tater Charitable Trust begins its journey of service.",
      icon: "Landmark" as const,
      stats: [],
    },
    {
      id: "y2",
      year: "2012–21",
      title: "Growing Years",
      text: "Expanding in education and healthcare through annual scholarships and eye camps.",
      icon: "ArrowUpRight" as const,
      stats: [],
    },
    {
      id: "y3",
      year: "2022",
      title: "10th Scholarship Distribution",
      text: "A decade of scholarship support, celebrated with a landmark tally.",
      icon: "GraduationCap" as const,
      stats: ["4,298 students supported", "₹1.66 crore over 13 years"],
    },
    {
      id: "y4",
      year: "2022",
      title: "Large-scale Eye Care Initiative — Chennai Metro Mahaveer Club",
      text: "Eye care support reached communities across Chennai through a large-scale initiative.",
      icon: "Stethoscope" as const,
      stats: [
        "1,212 eye camps",
        "1,67,743 screenings",
        "46,926 surgeries",
        "14,281 pairs of spectacles",
      ],
    },
    {
      id: "y5",
      year: "2022",
      title: "Seva Mahostav",
      text: "A large multi-sector initiative supporting education, healthcare, Gau Seva, eye care, community welfare, Jain institutions and national disaster relief.",
      icon: "HandHeart" as const,
      stats: ["₹5 crore commitment"],
    },
    {
      id: "y6",
      year: "2026",
      title: "14th Scholarship Distribution",
      text: "Another cohort of students supported in their pursuit of education.",
      icon: "GraduationCap" as const,
      stats: ["456 students", "₹25.07 lakh in scholarships"],
    },
    {
      id: "y7",
      year: "2026",
      title: "Empowering Lives",
      text: "Mobility and independence restored for those who need it most.",
      icon: "Heart" as const,
      stats: ["500 individuals supported with limbs and wheelchairs"],
    },
  ],
  reach: Object.entries(places).map(([state, cities], i) => ({
    id: `r${i + 1}`,
    state,
    cities: cities.map((name) => ({
      name,
      x: CITY_COORDS[name][0],
      y: CITY_COORDS[name][1],
    })),
  })),
  partners: [
    { id: "p1", name: "RYA Hospital", logo: ryaLogo },
    { id: "p2", name: "Kewal Chand Mohini Bai Daga Dialysis Centre" },
    {
      id: "p3",
      name: "Mahaveer Rajasthani International School",
      logo: mahaveerLogo,
    },
    { id: "p4", name: "Sankara Eye Hospital", logo: sankaraLogo },
    { id: "p5", name: "Lions Eye Bank", logo: lionsLogo },
    { id: "p6", name: "Jain Mission Trust", logo: jainLogo },
    { id: "p7", name: "Vivekananda Education Society", logo: vesLogo },
    { id: "p8", name: "Adinath Jain Trust", logo: adinathLogo },
    { id: "p9", name: "RMD Care Trust", logo: rmdCareTrustLogo },
    { id: "p10", name: "Seva Bharathi", logo: sevaBharathiLogo },
    {
      id: "p11",
      name: "Chennai Metro Mahaveer",
      logo: chennaiMetroMahaveerLogo,
    },
    {
      id: "p12",
      name: "Rajasthani Association Tamil Nadu",
      logo: rajasthaniAssociationTnLogo,
    },
  ],
  gallery: [
    {
      id: "g1",
      cat: "Healthcare",
      caption: "Free Eye Screening Camp Chennai",
      ratio: 2.346,
      img: freeEyeScreeningCampChennaiImg,
    },
    {
      id: "g2",
      cat: "Education",
      caption: "Annual Scholarship Ceremony Chennai",
      ratio: 1.5,
      img: annualScholarshipCeremonyChennaiImg,
    },
    {
      id: "g3",
      cat: "Healthcare",
      caption: "Maternity Ward Inauguration",
      ratio: 1.794,
      img: maternityWardInaugurationImg,
      previewImg: maternityWardInaugurationPreviewImg,
    },
    {
      id: "g4",
      cat: "Animal Welfare",
      caption: "Khwaspura Gaushala Shed",
      ratio: 1.333,
      img: khwaspuraGaushalaShedImg,
      hideFromAll: true,
    },
    {
      id: "g5",
      cat: "Healthcare",
      caption: "Sankara Eye Hospital Block",
      ratio: 1.333,
      img: sankaraEyeHospitalBlockImg,
    },
    {
      id: "g6",
      cat: "Healthcare",
      caption: "Cataract Surgery Follow-Up",
      ratio: 2.221,
      img: cataractSurgeryFollowUpImg,
    },
    {
      id: "g7",
      cat: "Community",
      caption: "Food Distribution Drive",
      ratio: 1.662,
      img: foodDistributionDriveImg,
      hideFromAll: true,
    },
    {
      id: "g8",
      cat: "Community",
      caption: "Room Donation To Dharamshala Lodging",
      ratio: 2.207,
      img: roomDonationDharamshalaLodgingImg,
    },
    {
      id: "g9",
      cat: "Healthcare",
      caption: "Newborn Care Unit",
      ratio: 1.794,
      img: newbornCareUnitImg,
      previewImg: newbornCareUnitPreviewImg,
      hideFromAll: true,
    },
    {
      id: "g10",
      cat: "Animal Welfare",
      caption: "Chaara Godown Nagaur",
      ratio: 1.794,
      img: chaaraGodownNagaurImg,
      previewImg: chaaraGodownNagaurPreviewImg,
    },
    {
      id: "g11",
      cat: "Community",
      caption: "Food Distribution Drive",
      ratio: 0.75,
      img: foodDistributionDriveNewImg,
      hideFromAll: true,
    },
    {
      id: "g12",
      cat: "Community",
      caption: "Food Distribution Drive With Akshaya Trust",
      ratio: 2.165,
      img: foodDistributionDriveAkshayaTrustImg,
    },
    {
      id: "g13",
      cat: "Healthcare",
      caption: "Prosthetics Distribution",
      ratio: 1.796,
      img: prostheticsDistributionImg,
      hideFromAll: true,
    },
    {
      id: "g14",
      cat: "Community",
      caption: "Hall Donated In Marudhar Merta City",
      ratio: 1.754,
      img: hallDonatedMarudharMertaCityImg,
      hideFromAll: true,
    },
    {
      id: "g15",
      cat: "Healthcare",
      caption:
        "MoU Between Our Trust And Sewa Bharti Tamil Nadu For Multi-Specialty Hospital",
      ratio: 1.643,
      img: mouSewaBhartiMultiSpecialtyHospitalImg,
      previewImg: mouSewaBhartiMultiSpecialtyHospitalPreviewImg,
    },
    {
      id: "g16",
      cat: "Healthcare",
      caption: "Multispeciality Hospital Bhoomi Pooja",
      ratio: 1.5,
      img: multispecialityHospitalBhoomiPoojaImg,
    },
    {
      id: "g17",
      cat: "Community",
      caption: "Food Distribution",
      ratio: 1.333,
      img: foodDistributionImg,
      hideFromAll: true,
    },
    {
      id: "g18",
      cat: "Healthcare",
      caption: "Cataract Surgery With Chennai Metro Mahaveer",
      ratio: 1.499,
      img: cataractSurgeryChennaiMetroMahaveerImg,
      hideFromAll: true,
    },
    {
      id: "g19",
      cat: "Community",
      caption: "Awarded Rajasthan Shree By Rajasthan Sangh Chennai",
      ratio: 1.504,
      img: awardedRajasthanShreeImg,
    },
    {
      id: "g20",
      cat: "Healthcare",
      caption: "Prosthetics Distribution With Adinath Jain Trust Chennai",
      ratio: 1.333,
      img: prostheticsDistributionAdinathJainTrustImg,
    },
    {
      id: "g21",
      cat: "Education",
      caption: "10th Scholarship Distribution Ceremony",
      ratio: 1.345,
      img: tenthScholarshipDistributionImg,
      previewImg: tenthScholarshipDistributionPreviewImg,
      hideFromAll: true,
    },
    {
      id: "g22",
      cat: "Education",
      caption: "11th Scholarship Distribution Ceremony",
      ratio: 1.451,
      img: eleventhScholarshipDistributionImg,
      hideFromAll: true,
    },
    {
      id: "g23",
      cat: "Education",
      caption: "13th Scholarship Distribution To 439 Students",
      ratio: 1.219,
      img: thirteenthScholarshipDistributionImg,
      hideFromAll: true,
    },
    {
      id: "g24",
      cat: "Education",
      caption: "22 Lakh Scholarship Distribution Ceremony",
      ratio: 2.09,
      img: twentyTwoLakhScholarshipDistributionImg,
      previewImg: twentyTwoLakhScholarshipDistributionPreviewImg,
      hideFromAll: true,
    },
    {
      id: "g25",
      cat: "Education",
      caption: "Inauguration Of Vivekananda Vidyalaya",
      ratio: 1.452,
      img: inaugurationVivekanandaVidyalayaImg,
      previewImg: inaugurationVivekanandaVidyalayaPreviewImg,
    },
    {
      id: "g26",
      cat: "Education",
      caption: "Vivekananda Vidyalaya",
      ratio: 1.566,
      img: vivekanandaVidyalayaImg,
    },
    {
      id: "g27",
      cat: "Education",
      caption: "Bhoomi Pooja Ceremony — Vivekananda Vidhyalaya",
      ratio: 0.708,
      img: bhoomiPoojaCeremonyVivekanandaImg,
      hideFromAll: true,
    },
    {
      id: "g28",
      cat: "Healthcare",
      caption: "Bhoomi Pooja Ceremony — Multi-speciality Hospital",
      ratio: 0.922,
      img: bhoomiPoojaCeremonyHospitalImg,
      hideFromAll: true,
    },
    {
      id: "g29",
      cat: "Healthcare",
      caption: "Bhoomi Pooja, Cancer Hospital in Goonipalayam",
      ratio: 2.154,
      img: bhoomiPoojaCancerHospitalGoonipalayamImg,
      previewImg: bhoomiPoojaCancerHospitalGoonipalayamPreviewImg,
      hideFromAll: true,
    },
    {
      id: "g30",
      cat: "Healthcare",
      caption: "Cancer and Palliative Care Hospital in Goonipalayam",
      ratio: 1.468,
      img: cancerHospitalGoonipalayamPressImg,
      previewImg: cancerHospitalGoonipalayamPressPreviewImg,
      hideFromAll: true,
    },
    {
      id: "g31",
      cat: "Community",
      caption: "Shri Sambhavnath Jain Mandir Prathistha Mahamahotsav",
      ratio: 2.165,
      img: sambhavnathJainMandirPrathisthaImg,
      hideFromAll: true,
    },
    {
      id: "g32",
      cat: "Animal Welfare",
      caption: "Cattle Feeding in Gaushala",
      ratio: 0.75,
      img: cattleFeedingGaushalaImg,
      hideFromAll: true,
    },
    {
      id: "g33",
      cat: "Healthcare",
      caption: "Maternity And Child Care Home Handover",
      ratio: 2.928,
      img: maternityChildCareHomeHandoverImg,
      previewImg: maternityChildCareHomeHandoverPreviewImg,
      hideFromAll: true,
    },
    {
      id: "g34",
      cat: "Healthcare",
      caption: "Maternity Home Plaque Presentation",
      ratio: 1.432,
      img: maternityHomePlaquePresentationImg,
    },
    {
      id: "g35",
      cat: "Healthcare",
      caption: "Maternity Hospital",
      ratio: 1.488,
      img: maternityHospitalImg,
      hideFromAll: true,
    },
  ],
};
