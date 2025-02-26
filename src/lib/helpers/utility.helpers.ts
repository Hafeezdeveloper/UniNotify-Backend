import {Types} from 'mongoose';
import {randomInt} from 'crypto';
import {HttpException} from '@nestjs/common';
import {ApiResponse} from '@nestjs/swagger';
export interface PaginationResult {
  currentPage: number;
  totalPages: number;
  limit: number;
  totalItems: number;
}

export function paginationParams(
  page?: number,
  limit?: number,
): {
  currentPage: number;
  pageSize: number;
  skip: number;
} {
  const currentPage = Number(page || 1); // Default to 1 if page is undefined
  const pageSize = Number(limit || 10); // Default to 10 if limit is undefined
  const skip = (currentPage - 1) * pageSize;
  return {currentPage, pageSize, skip};
}


// export function getShiftsForWeek(repeat: any, weekStartDate: Date, weekEndDate: Date): Date[] {
//   console.log("repeat",repeat);
  
//   const { isRepeated, recurrence, repeatEvery, occursOn, endDate } = repeat;

//   if (!isRepeated || recurrence !== 'WEEKLY') {
//     return []; 
//   }

//   const recurrenceEndDate = new Date(endDate);
//   const result: Date[] = [];

//   // If the week range is outside the recurrence range, return no events
//   if (weekStartDate > recurrenceEndDate) {
//     return result;
//   }

//   let recurrenceStartDate = new Date(weekStartDate);

  
//   while (recurrenceStartDate < weekStartDate) {
//     recurrenceStartDate.setDate(recurrenceStartDate.getDate() + parseInt(repeatEvery, 10) * 7);
//   }

//   // Iterate through the specified days to find occurrences
//   for (const day of occursOn) {
//     const dayIndex = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(day);

//     if (dayIndex === -1) {
//       continue; // Skip invalid days
//     }

//     const occurrence = new Date(recurrenceStartDate);
//     occurrence.setDate(recurrenceStartDate.getDate() + dayIndex);

//     // Check if occurrence falls within the specified week and recurrence range
//     if (occurrence >= weekStartDate && occurrence <= weekEndDate && occurrence <= recurrenceEndDate) {
//       result.push(occurrence);
//     }
//   }


// }


export function getShiftsForWeek(repeat: any, weekStartDate: Date, weekEndDate: Date): Date[] {

  console.log("weekStartDate",weekStartDate,"weekEndDate",weekEndDate);
  
  const { isRepeated, recurrence, repeatEvery, occursOn, endDate } = repeat;

  if (!isRepeated || recurrence !== 'weekly') {
    return [];
  }

  const recurrenceEndDate = new Date(endDate);
  const result: Date[] = [];

  // If the week range is outside the recurrence range, return no events
  if (weekStartDate > recurrenceEndDate) {
    console.log("check",result);
    
    return result;
  
  }

  let recurrenceStartDate = new Date(weekStartDate);

  // Ensure the recurrence start date is aligned with the first occurrence of the week
  while (recurrenceStartDate < weekStartDate) {
    recurrenceStartDate.setDate(recurrenceStartDate.getDate() + parseInt(repeatEvery, 10) * 7);
  }

  // Iterate through the specified days to find occurrences
  for (const day of occursOn) {
    const dayIndex = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(day);

    if (dayIndex === -1) {
      continue; // Skip invalid days
    }

    const occurrence = new Date(recurrenceStartDate);
    occurrence.setDate(recurrenceStartDate.getDate() + dayIndex);

    // Check if occurrence falls within the specified week and recurrence range
    if (occurrence >= weekStartDate && occurrence <= weekEndDate && occurrence <= recurrenceEndDate) {
      result.push(occurrence);
    }
  }

  console.log("result",result);
  
  return result; // Ensure the function returns the result

}


export function getDocumentTotal(totalCount: [{value: number}] | any) {
  return totalCount && totalCount.length > 0 ? totalCount[0].value : 0;
}

export function Pagination({totalItems, page, limit}): PaginationResult {
  const currentPage = Number(page);
  const totalPages = Math.ceil(totalItems / limit);

  return {
    currentPage,
    totalPages,
    limit,
    totalItems,
  };
}

export function generateNineDigitOTP() {
  const otp = Math.floor(100000000 + Math.random() * 9000);
  return otp.toString();
}

export function successHandler(message: string, data = {}) {
  return {success: true, message, ...data};
}

export function parseBoolean(value?: string): boolean | undefined {
  if (value === undefined || value === '') {
    return undefined;
  }
  return value === 'true';
}

export function failureHandler(
  exceptionStatus: any,
  message: string,
  data = {},
) {
  throw new HttpException(message, exceptionStatus);
  // return { success: false, message, ...data }
}

export function generateOTP(): number {
  return randomInt(1000, 10000);
}

export function generateInvoiceNumber(): string {
  const prefix = 'INV-'; // Invoice prefix
  const time = new Date().getTime().toString().slice(-6);
  const randomPart = randomInt(1000, 10000);
  return `${prefix}${time}${randomPart}`;
}

export function extractDate(isoDateString) {
  const date = new Date(isoDateString);

  const year = date.getUTCFullYear(); // Get the year
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Get the month (01-12)
  const day = String(date.getUTCDate()).padStart(2, '0'); // Get the day (01-31)

  return `${year}-${month}-${day}`; // Return formatted date
}

// function for generating unique user id's for two users
export function getNode(
  senderId: Types.ObjectId | string,
  receiverId: Types.ObjectId | string,
): string {
  if (senderId > receiverId) {
    return `${receiverId}-${senderId}`;
  } else {
    return `${senderId}-${receiverId}`;
  }
}

export function capitalizeFirstLetter(word: string) {
  if (!word) return '';
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export function generateRandomString(length = 7) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// extending ApiResponse decorator to reduce lines of code
export function createApiResponse(
  status: number,
  message: string,
  success: boolean,
  data = {},
) {
  return ApiResponse({
    status,
    description: message,
    schema: {
      example: {
        success,
        message,
        ...data,
      },
    },
  });
}

export function validateDates(startDate: Date, endDate: Date) {
  const currentDate = new Date().setHours(0, 0, 0, 0);
  const startDateTime = new Date(startDate).getTime();
  const endDateTime = new Date(endDate).getTime();

  if (startDateTime >= currentDate) {
    return failureHandler(400, 'Start date must be before the current date.');
  }

  if (startDateTime >= endDateTime) {
    return failureHandler(400, 'Start date must be before the end date.');
  }

  return {isValid: true, message: 'Valid Dates'};
}

export function toCamelCase(str) {
  return str
    .split(/[\s-_]+/)
    .map((word, index) => {
      if (index === 0) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join('');
}
