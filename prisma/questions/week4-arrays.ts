// Week 4: Arrays - 50 questions

export const week4Arrays = [
  // ===== Topic 12: Array Basics (15 questions) =====
  {
    title: "Create and Print Array",
    slug: "create-print-array",
    type: "CODE",
    prompt: "Create an array with values {1, 2, 3} and print the first element.",
    constraints: null,
    difficulty: 1,
    estimatedMinutes: 3,
    points: 15,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // Create array and print first element

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int[] arr = {1, 2, 3};
        System.out.println(arr[0]);
    }
}`,
    tests: [
      { input: "", expectedOutput: "1", isHidden: false },
    ],
    hints: [
      "Use int[] arr = {1, 2, 3};",
      "Access first element with arr[0]",
      "Array indices start at 0"
    ],
    tags: ["arrays", "basics", "indexing"],
  },
  {
    title: "Array Length",
    slug: "array-length",
    type: "CODE",
    prompt: "Create an array with 5 elements and print its length.",
    constraints: null,
    difficulty: 1,
    estimatedMinutes: 3,
    points: 15,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        int[] arr = {10, 20, 30, 40, 50};
        // Print the length

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int[] arr = {10, 20, 30, 40, 50};
        System.out.println(arr.length);
    }
}`,
    tests: [
      { input: "", expectedOutput: "5", isHidden: false },
    ],
    hints: [
      "Use .length property (not method)",
      "No parentheses needed",
      "arr.length gives the size"
    ],
    tags: ["arrays", "length", "basics"],
  },
  {
    title: "Access Last Element",
    slug: "access-last-element",
    type: "CODE",
    prompt: "Print the last element of the array {5, 10, 15, 20, 25}.",
    constraints: "Use length to find the index.",
    difficulty: 2,
    estimatedMinutes: 4,
    points: 20,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        int[] arr = {5, 10, 15, 20, 25};
        // Print last element using length

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int[] arr = {5, 10, 15, 20, 25};
        System.out.println(arr[arr.length - 1]);
    }
}`,
    tests: [
      { input: "", expectedOutput: "25", isHidden: false },
    ],
    hints: [
      "Last index is length - 1",
      "arr.length is 5, last index is 4",
      "arr[arr.length - 1]"
    ],
    tags: ["arrays", "indexing"],
  },
  {
    title: "Modify Array Element",
    slug: "modify-array-element",
    type: "CODE",
    prompt: "Change the second element to 100 and print it.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 4,
    points: 20,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        int[] arr = {1, 2, 3};
        // Change second element to 100 and print

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int[] arr = {1, 2, 3};
        arr[1] = 100;
        System.out.println(arr[1]);
    }
}`,
    tests: [
      { input: "", expectedOutput: "100", isHidden: false },
    ],
    hints: [
      "Second element is at index 1",
      "Assign with arr[1] = 100",
      "Then print arr[1]"
    ],
    tags: ["arrays", "modification"],
  },
  {
    title: "Print All Elements",
    slug: "print-all-elements",
    type: "CODE",
    prompt: "Print all elements of {1, 2, 3, 4, 5} on separate lines using a loop.",
    constraints: "Use a for loop.",
    difficulty: 2,
    estimatedMinutes: 5,
    points: 25,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        int[] arr = {1, 2, 3, 4, 5};
        // Print all elements

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int[] arr = {1, 2, 3, 4, 5};
        for (int i = 0; i < arr.length; i++) {
            System.out.println(arr[i]);
        }
    }
}`,
    tests: [
      { input: "", expectedOutput: "1\n2\n3\n4\n5", isHidden: false },
    ],
    hints: [
      "Loop from 0 to length - 1",
      "i < arr.length (not <=)",
      "Print arr[i] each iteration"
    ],
    tags: ["arrays", "loops", "traversal"],
  },
  {
    title: "Sum Array Elements",
    slug: "sum-array-elements",
    type: "CODE",
    prompt: "Calculate and print the sum of all elements in {2, 4, 6, 8, 10}.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 5,
    points: 25,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        int[] arr = {2, 4, 6, 8, 10};
        // Calculate and print sum

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int[] arr = {2, 4, 6, 8, 10};
        int sum = 0;
        for (int i = 0; i < arr.length; i++) {
            sum += arr[i];
        }
        System.out.println(sum);
    }
}`,
    tests: [
      { input: "", expectedOutput: "30", isHidden: false },
    ],
    hints: [
      "Start with sum = 0",
      "Add each element to sum",
      "2+4+6+8+10 = 30"
    ],
    tags: ["arrays", "sum", "loops"],
  },
  {
    title: "Array with new Keyword",
    slug: "array-new-keyword",
    type: "CODE",
    prompt: "Create an array of size 3 using new, set values to 10, 20, 30, and print the second element.",
    constraints: "Use: int[] arr = new int[3]",
    difficulty: 2,
    estimatedMinutes: 5,
    points: 25,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // Create array with new, set values, print second

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int[] arr = new int[3];
        arr[0] = 10;
        arr[1] = 20;
        arr[2] = 30;
        System.out.println(arr[1]);
    }
}`,
    tests: [
      { input: "", expectedOutput: "20", isHidden: false },
    ],
    hints: [
      "new int[3] creates array of size 3",
      "Assign values to each index",
      "Second element is at index 1"
    ],
    tags: ["arrays", "new", "initialization"],
  },
  {
    title: "Find Maximum",
    slug: "find-maximum",
    type: "CODE",
    prompt: "Find and print the maximum value in {4, 2, 9, 7, 5}.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 6,
    points: 30,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        int[] arr = {4, 2, 9, 7, 5};
        // Find and print max

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int[] arr = {4, 2, 9, 7, 5};
        int max = arr[0];
        for (int i = 1; i < arr.length; i++) {
            if (arr[i] > max) {
                max = arr[i];
            }
        }
        System.out.println(max);
    }
}`,
    tests: [
      { input: "", expectedOutput: "9", isHidden: false },
    ],
    hints: [
      "Start with max = first element",
      "Compare each element with max",
      "Update max if current is larger"
    ],
    tags: ["arrays", "max", "algorithm"],
  },
  {
    title: "Find Minimum",
    slug: "find-minimum",
    type: "CODE",
    prompt: "Find and print the minimum value in {8, 3, 7, 1, 9}.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 6,
    points: 30,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        int[] arr = {8, 3, 7, 1, 9};
        // Find and print min

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int[] arr = {8, 3, 7, 1, 9};
        int min = arr[0];
        for (int i = 1; i < arr.length; i++) {
            if (arr[i] < min) {
                min = arr[i];
            }
        }
        System.out.println(min);
    }
}`,
    tests: [
      { input: "", expectedOutput: "1", isHidden: false },
    ],
    hints: [
      "Similar to finding max",
      "Update min if current is smaller",
      "Use < instead of >"
    ],
    tags: ["arrays", "min", "algorithm"],
  },
  {
    title: "Count Elements",
    slug: "count-elements",
    type: "CODE",
    prompt: "Count how many times 5 appears in {5, 3, 5, 2, 5, 1}.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 5,
    points: 25,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        int[] arr = {5, 3, 5, 2, 5, 1};
        // Count occurrences of 5

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int[] arr = {5, 3, 5, 2, 5, 1};
        int count = 0;
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == 5) {
                count++;
            }
        }
        System.out.println(count);
    }
}`,
    tests: [
      { input: "", expectedOutput: "3", isHidden: false },
    ],
    hints: [
      "Start with count = 0",
      "Check if each element equals 5",
      "Increment count when found"
    ],
    tags: ["arrays", "count", "search"],
  },
  {
    title: "Average of Array",
    slug: "average-array",
    type: "CODE",
    prompt: "Calculate and print the average of {10, 20, 30, 40, 50} as a double.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 6,
    points: 30,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        int[] arr = {10, 20, 30, 40, 50};
        // Calculate and print average

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int[] arr = {10, 20, 30, 40, 50};
        int sum = 0;
        for (int i = 0; i < arr.length; i++) {
            sum += arr[i];
        }
        double avg = (double) sum / arr.length;
        System.out.println(avg);
    }
}`,
    tests: [
      { input: "", expectedOutput: "30.0", isHidden: false },
    ],
    hints: [
      "First calculate the sum",
      "Divide by length for average",
      "Cast to double for decimal result"
    ],
    tags: ["arrays", "average", "math"],
  },
  {
    title: "Enhanced For Loop",
    slug: "enhanced-for-loop",
    type: "CODE",
    prompt: "Print all elements of {1, 2, 3} using an enhanced for loop (for-each).",
    constraints: "Use for (int x : arr) syntax.",
    difficulty: 2,
    estimatedMinutes: 4,
    points: 20,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        int[] arr = {1, 2, 3};
        // Use enhanced for loop

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int[] arr = {1, 2, 3};
        for (int x : arr) {
            System.out.println(x);
        }
    }
}`,
    tests: [
      { input: "", expectedOutput: "1\n2\n3", isHidden: false },
    ],
    hints: [
      "Syntax: for (int element : array)",
      "x takes each value automatically",
      "No need for index variable"
    ],
    tags: ["arrays", "for-each", "loops"],
  },
  {
    title: "Print Array Reversed",
    slug: "print-array-reversed",
    type: "CODE",
    prompt: "Print elements of {1, 2, 3, 4, 5} in reverse order.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 5,
    points: 25,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        int[] arr = {1, 2, 3, 4, 5};
        // Print in reverse

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int[] arr = {1, 2, 3, 4, 5};
        for (int i = arr.length - 1; i >= 0; i--) {
            System.out.println(arr[i]);
        }
    }
}`,
    tests: [
      { input: "", expectedOutput: "5\n4\n3\n2\n1", isHidden: false },
    ],
    hints: [
      "Start at length - 1",
      "Go down to 0",
      "Decrement with i--"
    ],
    tags: ["arrays", "reverse", "loops"],
  },
  {
    title: "String Array",
    slug: "string-array",
    type: "CODE",
    prompt: "Create a String array with {\"Hello\", \"World\"} and print both elements.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 4,
    points: 20,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // Create String array and print

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        String[] arr = {"Hello", "World"};
        System.out.println(arr[0]);
        System.out.println(arr[1]);
    }
}`,
    tests: [
      { input: "", expectedOutput: "Hello\nWorld", isHidden: false },
    ],
    hints: [
      "Use String[] for string arrays",
      "String values in double quotes",
      "Access like int arrays"
    ],
    tags: ["arrays", "String", "basics"],
  },
  {
    title: "Contains Element",
    slug: "contains-element",
    type: "CODE",
    prompt: "Check if 7 exists in {3, 5, 7, 9}. Print true or false.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 5,
    points: 25,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        int[] arr = {3, 5, 7, 9};
        // Check if 7 exists

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int[] arr = {3, 5, 7, 9};
        boolean found = false;
        for (int x : arr) {
            if (x == 7) {
                found = true;
                break;
            }
        }
        System.out.println(found);
    }
}`,
    tests: [
      { input: "", expectedOutput: "true", isHidden: false },
    ],
    hints: [
      "Start with found = false",
      "Set to true when found",
      "Can break early once found"
    ],
    tags: ["arrays", "search", "contains"],
  },

  // ===== Topic 13: Array Operations (15 questions) =====
  {
    title: "Copy Array",
    slug: "copy-array",
    type: "CODE",
    prompt: "Copy elements from source array to destination and print the first element of dest.",
    constraints: "Use a loop to copy.",
    difficulty: 2,
    estimatedMinutes: 6,
    points: 30,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        int[] source = {1, 2, 3};
        int[] dest = new int[3];
        // Copy elements and print dest[0]

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int[] source = {1, 2, 3};
        int[] dest = new int[3];
        for (int i = 0; i < source.length; i++) {
            dest[i] = source[i];
        }
        System.out.println(dest[0]);
    }
}`,
    tests: [
      { input: "", expectedOutput: "1", isHidden: false },
    ],
    hints: [
      "Loop through source",
      "Assign dest[i] = source[i]",
      "dest now has copied values"
    ],
    tags: ["arrays", "copy", "loops"],
  },
  {
    title: "Reverse Array In Place",
    slug: "reverse-in-place",
    type: "CODE",
    prompt: "Reverse {1, 2, 3, 4, 5} in place and print all elements.",
    constraints: "Modify the original array.",
    difficulty: 3,
    estimatedMinutes: 8,
    points: 40,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        int[] arr = {1, 2, 3, 4, 5};
        // Reverse in place and print

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int[] arr = {1, 2, 3, 4, 5};
        int left = 0;
        int right = arr.length - 1;
        while (left < right) {
            int temp = arr[left];
            arr[left] = arr[right];
            arr[right] = temp;
            left++;
            right--;
        }
        for (int x : arr) {
            System.out.println(x);
        }
    }
}`,
    tests: [
      { input: "", expectedOutput: "5\n4\n3\n2\n1", isHidden: false },
    ],
    hints: [
      "Use two pointers: left and right",
      "Swap elements at both ends",
      "Move pointers toward center"
    ],
    tags: ["arrays", "reverse", "algorithm"],
  },
  {
    title: "Shift Elements Left",
    slug: "shift-left",
    type: "CODE",
    prompt: "Shift all elements left by 1. First element goes to end. Print all.",
    constraints: null,
    difficulty: 3,
    estimatedMinutes: 7,
    points: 35,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        int[] arr = {1, 2, 3, 4, 5};
        // Shift left and print
        // Should become: 2, 3, 4, 5, 1

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int[] arr = {1, 2, 3, 4, 5};
        int first = arr[0];
        for (int i = 0; i < arr.length - 1; i++) {
            arr[i] = arr[i + 1];
        }
        arr[arr.length - 1] = first;
        for (int x : arr) {
            System.out.println(x);
        }
    }
}`,
    tests: [
      { input: "", expectedOutput: "2\n3\n4\n5\n1", isHidden: false },
    ],
    hints: [
      "Save the first element",
      "Shift all others left",
      "Put first at the end"
    ],
    tags: ["arrays", "shift", "algorithm"],
  },
  {
    title: "Find Index Of",
    slug: "find-index-of",
    type: "CODE",
    prompt: "Find the index of value 30 in {10, 20, 30, 40}. Print -1 if not found.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 5,
    points: 25,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        int[] arr = {10, 20, 30, 40};
        // Find index of 30

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int[] arr = {10, 20, 30, 40};
        int index = -1;
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == 30) {
                index = i;
                break;
            }
        }
        System.out.println(index);
    }
}`,
    tests: [
      { input: "", expectedOutput: "2", isHidden: false },
    ],
    hints: [
      "Start with index = -1",
      "Set index when found",
      "30 is at index 2"
    ],
    tags: ["arrays", "search", "index"],
  },
  {
    title: "Count Even Numbers",
    slug: "count-even-numbers",
    type: "CODE",
    prompt: "Count how many even numbers are in {1, 2, 3, 4, 5, 6}.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 5,
    points: 25,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        int[] arr = {1, 2, 3, 4, 5, 6};
        // Count even numbers

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int[] arr = {1, 2, 3, 4, 5, 6};
        int count = 0;
        for (int x : arr) {
            if (x % 2 == 0) {
                count++;
            }
        }
        System.out.println(count);
    }
}`,
    tests: [
      { input: "", expectedOutput: "3", isHidden: false },
    ],
    hints: [
      "Use modulo to check even",
      "x % 2 == 0 means even",
      "2, 4, 6 are even = 3 total"
    ],
    tags: ["arrays", "count", "even-odd"],
  },
  {
    title: "Sum of Positive Numbers",
    slug: "sum-positive",
    type: "CODE",
    prompt: "Sum only the positive numbers in {-3, 2, -1, 5, 4}.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 5,
    points: 25,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        int[] arr = {-3, 2, -1, 5, 4};
        // Sum positive numbers

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int[] arr = {-3, 2, -1, 5, 4};
        int sum = 0;
        for (int x : arr) {
            if (x > 0) {
                sum += x;
            }
        }
        System.out.println(sum);
    }
}`,
    tests: [
      { input: "", expectedOutput: "11", isHidden: false },
    ],
    hints: [
      "Check if x > 0",
      "Only add positive numbers",
      "2 + 5 + 4 = 11"
    ],
    tags: ["arrays", "sum", "filter"],
  },
  {
    title: "Double All Elements",
    slug: "double-all-elements",
    type: "CODE",
    prompt: "Double each element in {1, 2, 3} and print all.",
    constraints: "Modify the array in place.",
    difficulty: 2,
    estimatedMinutes: 5,
    points: 25,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        int[] arr = {1, 2, 3};
        // Double each element and print

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int[] arr = {1, 2, 3};
        for (int i = 0; i < arr.length; i++) {
            arr[i] *= 2;
        }
        for (int x : arr) {
            System.out.println(x);
        }
    }
}`,
    tests: [
      { input: "", expectedOutput: "2\n4\n6", isHidden: false },
    ],
    hints: [
      "Need index to modify array",
      "arr[i] *= 2 doubles in place",
      "Can't modify with enhanced for"
    ],
    tags: ["arrays", "modification", "loops"],
  },
  {
    title: "All Positive Check",
    slug: "all-positive-check",
    type: "CODE",
    prompt: "Check if all elements in {1, 2, 3, 4, 5} are positive. Print true or false.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 5,
    points: 25,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        int[] arr = {1, 2, 3, 4, 5};
        // Check if all positive

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int[] arr = {1, 2, 3, 4, 5};
        boolean allPositive = true;
        for (int x : arr) {
            if (x <= 0) {
                allPositive = false;
                break;
            }
        }
        System.out.println(allPositive);
    }
}`,
    tests: [
      { input: "", expectedOutput: "true", isHidden: false },
    ],
    hints: [
      "Start with allPositive = true",
      "Set to false if any non-positive found",
      "Break early when found"
    ],
    tags: ["arrays", "validation", "all"],
  },
  {
    title: "Any Negative Check",
    slug: "any-negative-check",
    type: "CODE",
    prompt: "Check if any element in {5, 3, -1, 8} is negative. Print true or false.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 5,
    points: 25,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        int[] arr = {5, 3, -1, 8};
        // Check if any negative

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int[] arr = {5, 3, -1, 8};
        boolean hasNegative = false;
        for (int x : arr) {
            if (x < 0) {
                hasNegative = true;
                break;
            }
        }
        System.out.println(hasNegative);
    }
}`,
    tests: [
      { input: "", expectedOutput: "true", isHidden: false },
    ],
    hints: [
      "Start with hasNegative = false",
      "Set to true when found",
      "-1 is negative"
    ],
    tags: ["arrays", "validation", "any"],
  },
  {
    title: "Find Second Largest",
    slug: "find-second-largest",
    type: "CODE",
    prompt: "Find the second largest value in {5, 2, 9, 7, 3}.",
    constraints: null,
    difficulty: 3,
    estimatedMinutes: 8,
    points: 40,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        int[] arr = {5, 2, 9, 7, 3};
        // Find second largest

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int[] arr = {5, 2, 9, 7, 3};
        int max = Integer.MIN_VALUE;
        int second = Integer.MIN_VALUE;
        for (int x : arr) {
            if (x > max) {
                second = max;
                max = x;
            } else if (x > second && x != max) {
                second = x;
            }
        }
        System.out.println(second);
    }
}`,
    tests: [
      { input: "", expectedOutput: "7", isHidden: false },
    ],
    hints: [
      "Track both max and second",
      "When new max found, old max becomes second",
      "9 is max, 7 is second"
    ],
    tags: ["arrays", "algorithm", "second-max"],
  },
  {
    title: "Remove Duplicates Count",
    slug: "remove-duplicates-count",
    type: "CODE",
    prompt: "Count how many unique elements are in {1, 2, 2, 3, 3, 3}.",
    constraints: null,
    difficulty: 3,
    estimatedMinutes: 8,
    points: 40,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        int[] arr = {1, 2, 2, 3, 3, 3};
        // Count unique elements

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int[] arr = {1, 2, 2, 3, 3, 3};
        int unique = 1;  // First element is always unique
        for (int i = 1; i < arr.length; i++) {
            if (arr[i] != arr[i - 1]) {
                unique++;
            }
        }
        System.out.println(unique);
    }
}`,
    tests: [
      { input: "", expectedOutput: "3", isHidden: false },
    ],
    hints: [
      "Array is sorted, so duplicates are adjacent",
      "Compare each element with previous",
      "1, 2, 3 are unique = 3"
    ],
    tags: ["arrays", "unique", "algorithm"],
  },
  {
    title: "Merge Two Sorted Arrays",
    slug: "merge-sorted-arrays",
    type: "CODE",
    prompt: "Merge {1, 3, 5} and {2, 4, 6} into sorted order and print all.",
    constraints: null,
    difficulty: 3,
    estimatedMinutes: 10,
    points: 50,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        int[] a = {1, 3, 5};
        int[] b = {2, 4, 6};
        // Merge and print sorted

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int[] a = {1, 3, 5};
        int[] b = {2, 4, 6};
        int[] result = new int[6];
        int i = 0, j = 0, k = 0;
        while (i < a.length && j < b.length) {
            if (a[i] <= b[j]) {
                result[k++] = a[i++];
            } else {
                result[k++] = b[j++];
            }
        }
        while (i < a.length) result[k++] = a[i++];
        while (j < b.length) result[k++] = b[j++];
        for (int x : result) {
            System.out.println(x);
        }
    }
}`,
    tests: [
      { input: "", expectedOutput: "1\n2\n3\n4\n5\n6", isHidden: false },
    ],
    hints: [
      "Use two pointers",
      "Compare and take smaller",
      "Handle remaining elements"
    ],
    tags: ["arrays", "merge", "algorithm"],
  },

  // ===== Topic 14: Command Line Args (10 questions) =====
  {
    title: "Print First Argument",
    slug: "print-first-arg",
    type: "CODE",
    prompt: "Print the first command line argument. If none, print \"No args\".",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 4,
    points: 20,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // Print first argument or "No args"

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        if (args.length > 0) {
            System.out.println(args[0]);
        } else {
            System.out.println("No args");
        }
    }
}`,
    tests: [
      { input: "", expectedOutput: "No args", isHidden: false },
    ],
    hints: [
      "Check args.length first",
      "First arg is args[0]",
      "Print message if no args"
    ],
    tags: ["arrays", "args", "command-line"],
  },
  {
    title: "Count Arguments",
    slug: "count-arguments",
    type: "CODE",
    prompt: "Print the number of command line arguments provided.",
    constraints: null,
    difficulty: 1,
    estimatedMinutes: 2,
    points: 15,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // Print number of arguments

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        System.out.println(args.length);
    }
}`,
    tests: [
      { input: "", expectedOutput: "0", isHidden: false },
    ],
    hints: [
      "args is an array",
      "Use .length property",
      "0 args when none provided"
    ],
    tags: ["arrays", "args", "length"],
  },
  {
    title: "Sum Numeric Args",
    slug: "sum-numeric-args",
    type: "CODE",
    prompt: "If two numeric arguments are provided, print their sum. Otherwise print 0.",
    constraints: "Parse strings to integers.",
    difficulty: 3,
    estimatedMinutes: 6,
    points: 35,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // Sum two numeric arguments

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        if (args.length >= 2) {
            int a = Integer.parseInt(args[0]);
            int b = Integer.parseInt(args[1]);
            System.out.println(a + b);
        } else {
            System.out.println(0);
        }
    }
}`,
    tests: [
      { input: "", expectedOutput: "0", isHidden: false },
    ],
    hints: [
      "Check if at least 2 args",
      "Use Integer.parseInt() to convert",
      "Args are strings by default"
    ],
    tags: ["arrays", "args", "parsing"],
  },
  {
    title: "Print All Arguments",
    slug: "print-all-args",
    type: "CODE",
    prompt: "Print all command line arguments, one per line. Print \"Empty\" if none.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 4,
    points: 25,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // Print all args

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        if (args.length == 0) {
            System.out.println("Empty");
        } else {
            for (String arg : args) {
                System.out.println(arg);
            }
        }
    }
}`,
    tests: [
      { input: "", expectedOutput: "Empty", isHidden: false },
    ],
    hints: [
      "Check for empty args first",
      "Loop through args array",
      "Each arg is a String"
    ],
    tags: ["arrays", "args", "loops"],
  },
  {
    title: "Reverse Arguments",
    slug: "reverse-arguments",
    type: "CODE",
    prompt: "Print command line arguments in reverse order. Print \"None\" if empty.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 5,
    points: 25,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // Print args in reverse

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        if (args.length == 0) {
            System.out.println("None");
        } else {
            for (int i = args.length - 1; i >= 0; i--) {
                System.out.println(args[i]);
            }
        }
    }
}`,
    tests: [
      { input: "", expectedOutput: "None", isHidden: false },
    ],
    hints: [
      "Loop from length-1 down to 0",
      "Decrement with i--",
      "Check for empty first"
    ],
    tags: ["arrays", "args", "reverse"],
  },

  // ===== Topic 15: Pass by Value (10 questions) =====
  {
    title: "Primitive Pass by Value",
    slug: "primitive-pass-value",
    type: "CODE",
    prompt: "The modifyValue method tries to change x. Print x after calling it to show it's unchanged.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 4,
    points: 25,
    starterCode: `public class Solution {
    public static void modifyValue(int num) {
        num = 100;
    }

    public static void main(String[] args) {
        int x = 5;
        modifyValue(x);
        // Print x to show it's still 5

    }
}`,
    solutionCode: `public class Solution {
    public static void modifyValue(int num) {
        num = 100;
    }

    public static void main(String[] args) {
        int x = 5;
        modifyValue(x);
        System.out.println(x);
    }
}`,
    tests: [
      { input: "", expectedOutput: "5", isHidden: false },
    ],
    hints: [
      "Java passes primitives by value",
      "The method gets a copy",
      "Original x is unchanged"
    ],
    tags: ["pass-by-value", "primitives"],
  },
  {
    title: "Array Pass by Reference Behavior",
    slug: "array-pass-reference",
    type: "CODE",
    prompt: "The modifyArray method changes the first element. Print arr[0] to show it changed.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 4,
    points: 25,
    starterCode: `public class Solution {
    public static void modifyArray(int[] arr) {
        arr[0] = 999;
    }

    public static void main(String[] args) {
        int[] arr = {1, 2, 3};
        modifyArray(arr);
        // Print arr[0] to show it changed

    }
}`,
    solutionCode: `public class Solution {
    public static void modifyArray(int[] arr) {
        arr[0] = 999;
    }

    public static void main(String[] args) {
        int[] arr = {1, 2, 3};
        modifyArray(arr);
        System.out.println(arr[0]);
    }
}`,
    tests: [
      { input: "", expectedOutput: "999", isHidden: false },
    ],
    hints: [
      "Arrays are objects",
      "Method receives reference to same array",
      "Changes affect original array"
    ],
    tags: ["pass-by-value", "arrays", "reference"],
  },
  {
    title: "Return Modified Value",
    slug: "return-modified-value",
    type: "CODE",
    prompt: "Since primitives are passed by value, use return to get the modified value.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 5,
    points: 25,
    starterCode: `public class Solution {
    public static int doubleValue(int num) {
        return num * 2;
    }

    public static void main(String[] args) {
        int x = 5;
        // Get doubled value and print

    }
}`,
    solutionCode: `public class Solution {
    public static int doubleValue(int num) {
        return num * 2;
    }

    public static void main(String[] args) {
        int x = 5;
        x = doubleValue(x);
        System.out.println(x);
    }
}`,
    tests: [
      { input: "", expectedOutput: "10", isHidden: false },
    ],
    hints: [
      "Assign return value to x",
      "x = doubleValue(x)",
      "This overwrites x with new value"
    ],
    tags: ["pass-by-value", "return"],
  },
  {
    title: "Swap Array Elements",
    slug: "swap-array-elements",
    type: "CODE",
    prompt: "Complete the swap method to swap elements at indices i and j. Print the array after swapping indices 0 and 2.",
    constraints: null,
    difficulty: 3,
    estimatedMinutes: 6,
    points: 30,
    starterCode: `public class Solution {
    public static void swap(int[] arr, int i, int j) {
        // Swap arr[i] and arr[j]

    }

    public static void main(String[] args) {
        int[] arr = {1, 2, 3};
        swap(arr, 0, 2);
        for (int x : arr) {
            System.out.println(x);
        }
    }
}`,
    solutionCode: `public class Solution {
    public static void swap(int[] arr, int i, int j) {
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }

    public static void main(String[] args) {
        int[] arr = {1, 2, 3};
        swap(arr, 0, 2);
        for (int x : arr) {
            System.out.println(x);
        }
    }
}`,
    tests: [
      { input: "", expectedOutput: "3\n2\n1", isHidden: false },
    ],
    hints: [
      "Use a temp variable",
      "temp = arr[i], arr[i] = arr[j], arr[j] = temp",
      "Array modification persists"
    ],
    tags: ["pass-by-value", "arrays", "swap"],
  },
  {
    title: "Fill Array",
    slug: "fill-array",
    type: "CODE",
    prompt: "Complete fillArray to set all elements to the given value. Print the first element.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 5,
    points: 25,
    starterCode: `public class Solution {
    public static void fillArray(int[] arr, int value) {
        // Fill all elements with value

    }

    public static void main(String[] args) {
        int[] arr = new int[3];
        fillArray(arr, 7);
        System.out.println(arr[0]);
    }
}`,
    solutionCode: `public class Solution {
    public static void fillArray(int[] arr, int value) {
        for (int i = 0; i < arr.length; i++) {
            arr[i] = value;
        }
    }

    public static void main(String[] args) {
        int[] arr = new int[3];
        fillArray(arr, 7);
        System.out.println(arr[0]);
    }
}`,
    tests: [
      { input: "", expectedOutput: "7", isHidden: false },
    ],
    hints: [
      "Loop through array",
      "Set each element to value",
      "Changes persist after method"
    ],
    tags: ["pass-by-value", "arrays", "fill"],
  },
]
