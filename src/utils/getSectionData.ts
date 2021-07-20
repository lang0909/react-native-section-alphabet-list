import { ISectionData, IData } from "../components/AlphabetList/types";

interface IAlphabetSet {
  [key: string]: IData[];
}

interface IEntry {
  title: string;
  data: IData[];
}

interface ILetterMap {
  [key: string]: number;
}

export const getSectionData = (
  data: IData[],
  charIndex: string[],
  uncategorizedAtTop = false
) => {
  const validLettersMap = getValidLettersMap(charIndex);
  const alphabetEntrySet: [string, IData[]][] = getAlphabetEntrySet(
    data,
    validLettersMap
  );

  return alphabetEntrySet
    .map(formatEntry)
    .sort((a, b) =>
      sortSectionsByCharIndex(a, b, validLettersMap, uncategorizedAtTop)
    )
    .map((section: ISectionData, index: number) => ({ ...section, index }));
};

const getValidLettersMap = (letterMap: string[]) => {
  const map: ILetterMap = {};

  letterMap.forEach((letter, i) => {
    map[letter.toLowerCase()] = i + 1;
  });

  return map;
};

const getAlphabetEntrySet = (data: IData[], validLettersMap: ILetterMap) => {
  const alphabetSet: IAlphabetSet = {};

  data.forEach((item) => {
    const letter = getItemFirstLetter(item.value, validLettersMap);
    if (!letter) return;

    if (!alphabetSet[letter]) {
      alphabetSet[letter] = [];
    }

    alphabetSet[letter].push(item);
  });

  return Object.entries(alphabetSet);
};

const getItemFirstLetter = (value: string, validLettersMap: ILetterMap) => {
  const firstChar = value.substring(0, 1);
  let firstVal = firstChar;
  if (firstChar.charCodeAt(0) >= 44032 && firstChar.charCodeAt(0) <= 55203) {
    let a = firstChar.charCodeAt(0);
    switch (true) {
      case a < 45208:
        firstVal = "ㄱ";
        break;
      case a < 45796:
        firstVal = "ㄴ";
        break;
      case a < 46972:
        firstVal = "ㄷ";
        break;
      case a < 47560:
        firstVal = "ㄹ";
        break;
      case a < 48148:
        firstVal = "ㅁ";
        break;
      case a < 49324:
        firstVal = "ㅂ";
        break;
      case a < 50500:
        firstVal = "ㅅ";
        break;
      case a < 51088:
        firstVal = "ㅇ";
        break;
      case a < 52264:
        firstVal = "ㅈ";
        break;
      case a < 52852:
        firstVal = "ㅊ";
        break;
      case a < 53440:
        firstVal = "ㅋ";
        break;
      case a < 54028:
        firstVal = "ㅌ";
        break;
      case a < 54616:
        firstVal = "ㅍ";
        break;
      case a < 55204:
        firstVal = "ㅎ";
        break;
    }
  }
  if (firstVal.charCodeAt(0) === 12594) {
    firstVal = "ㄱ";
  }
  if (firstVal.charCodeAt(0) === 12600) {
    firstVal = "ㄷ";
  }
  if (firstVal.charCodeAt(0) === 12611) {
    firstVal = "ㅂ";
  }
  if (firstVal.charCodeAt(0) === 12614) {
    firstVal = "ㅅ";
  }
  if (firstVal.charCodeAt(0) === 12617) {
    firstVal = "ㅈ";
  }
  const isValidLetter = validLettersMap[firstVal.toLowerCase()];

  if (isValidLetter) {
    return firstVal.toUpperCase();
  }

  return "#";
};

const formatEntry = (entry: [string, any[]]) => {
  const [title, unsortedData] = entry;
  const data = unsortedData.sort((a, b) =>
    alphabeticComparison(a.value, b.value)
  );

  return { title, data } as IEntry;
};

const isLetterHash = (charOne: string, charTwo: string) =>
  charOne !== "#" && charTwo === "#";

const sortSectionsByCharIndex = (
  a: IEntry,
  b: IEntry,
  validLettersMap: ILetterMap,
  uncategorizedAtTop: boolean
) => {
  const charA = a.title.toLowerCase();
  const charB = b.title.toLowerCase();

  const isBHash = isLetterHash(charA, charB);
  if (isBHash) return uncategorizedAtTop ? 1 : -1;

  const isAHash = isLetterHash(charB, charA);
  if (isAHash) return uncategorizedAtTop ? -1 : 1;

  const charAPosition = validLettersMap[charA];
  const charBPosition = validLettersMap[charB];
  return charAPosition - charBPosition;
};

const alphabeticComparison = (a: string, b: string) => {
  const aCap = a.toUpperCase();
  const bCap = b.toUpperCase();

  if (aCap < bCap) return -1;

  if (aCap > bCap) return 1;

  return 0;
};
