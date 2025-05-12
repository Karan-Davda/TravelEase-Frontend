
import { getAuthHeaders } from './authUtils';

/**
 * Helper function to safely encode URL parameters and prevent double encoding
 * This function checks if a value is already encoded and doesn't re-encode it
 */
export function safeEncode(value: string): string {
  // If the string is empty, return as is
  if (!value) {
    return value;
  }
  
  try {
    // Check if value is already encoded (contains %20 or other encoded characters)
    if (/%[0-9A-F]{2}/.test(value)) {
      // Already encoded, return as is
      return value;
    }
    
    // For values with spaces, directly use encodeURIComponent which will encode spaces as %20
    // This avoids the + encoding issue
    return encodeURIComponent(value);
  } catch (error) {
    console.error('Error in safeEncode:', error);
    // Return original value if encoding fails
    return value;
  }
}

/**
 * Helper function to make authenticated API calls
 */
export async function fetchWithAuth<T>(
  url: string, 
  method: string = 'GET', 
  body?: object
): Promise<T> {
  const headers = getAuthHeaders();
  
  const options: RequestInit = {
    method,
    headers,
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  console.log(`Making ${method} request to ${url}`);
  
  try {
    const response = await fetch(url, options);
    console.log(`Response status: ${response.status}`);
    
    // Handle non-JSON responses gracefully
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // For non-JSON responses, convert to text
      const text = await response.text();
      console.log('Non-JSON response:', text);
      
      // Try to parse as JSON anyway in case content type is misconfigured
      try {
        data = JSON.parse(text);
      } catch (e) {
        // If parsing fails, create a simple object with the text
        data = { message: text };
      }
    }
    
    if (!response.ok) {
      console.error('API error response:', data);
      throw new Error(data.message || `API request failed with status ${response.status}`);
    }
    
    return data as T;
  } catch (error) {
    console.error(`Error in fetchWithAuth for ${url}:`, error);
    throw error;
  }
}

/**
 * Helper function to make API calls without authentication
 */
export async function fetchApi<T>(
  url: string, 
  method: string = 'GET', 
  body?: object
): Promise<T> {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  console.log(`Making ${method} request to ${url}`);
  
  try {
    const response = await fetch(url, options);
    console.log(`Response status: ${response.status}`);
    
    // Handle non-JSON responses gracefully
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // For non-JSON responses, convert to text
      const text = await response.text();
      console.log('Non-JSON response:', text);
      
      // Try to parse as JSON anyway in case content type is misconfigured
      try {
        data = JSON.parse(text);
      } catch (e) {
        // If parsing fails, create a simple object with the text
        data = { message: text };
      }
    }
    
    if (!response.ok) {
      console.error('API error response:', data);
      throw new Error(data.message || `API request failed with status ${response.status}`);
    }
    
    return data as T;
  } catch (error) {
    console.error(`Error in fetchApi for ${url}:`, error);
    throw error;
  }
}
