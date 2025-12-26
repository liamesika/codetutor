// Week 5: 2D Arrays and I/O - 55 questions

export const week5_2DArrays = [
  // ===== Topic 16: 2D Arrays (20 questions) =====
  {
    title: "Create 2D Array",
    slug: "create-2d-array",
    type: "CODE",
    prompt: "Create a 2x3 2D array with values {{1,2,3}, {4,5,6}} and print the element at row 0, column 1.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 4,
    points: 20,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // Create 2D array and print element at [0][1]

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int[][] arr = {{1, 2, 3}, {4, 5, 6}};
        System.out.println(arr[0][1]);
    }
}`,
    tests: [
      { input: "", expectedOutput: "2", isHidden: false },
    ],
    hints: [
      "Use int[][] for 2D arrays",
      "{{row1}, {row2}} syntax",
      "[0][1] is row 0, column 1"
    ],
    tags: ["2d-arrays", "basics", "indexing"],
  },
  {
    title: "2D Array Dimensions",
    slug: "2d-array-dimensions",
    type: "CODE",
    prompt: "Print the number of rows and columns in the 2D array.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 4,
    points: 20,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        int[][] arr = {{1, 2, 3}, {4, 5, 6}};
        // Print rows, then columns

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int[][] arr = {{1, 2, 3}, {4, 5, 6}};
        System.out.println(arr.length);
        System.out.println(arr[0].length);
    }
}`,
    tests: [
      { input: "", expectedOutput: "2\n3", isHidden: false },
    ],
    hints: [
      "arr.length gives number of rows",
      "arr[0].length gives columns in first row",
      "2 rows, 3 columns"
    ],
    tags: ["2d-arrays", "length", "dimensions"],
  },
  {
    title: "Print All 2D Elements",
    slug: "print-all-2d-elements",
    type: "CODE",
    prompt: "Print all elements of the 2D array row by row, each element on its own line.",
    constraints: "Use nested loops.",
    difficulty: 2,
    estimatedMinutes: 6,
    points: 30,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        int[][] arr = {{1, 2}, {3, 4}, {5, 6}};
        // Print all elements

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int[][] arr = {{1, 2}, {3, 4}, {5, 6}};
        for (int i = 0; i < arr.length; i++) {
            for (int j = 0; j < arr[i].length; j++) {
                System.out.println(arr[i][j]);
            }
        }
    }
}`,
    tests: [
      { input: "", expectedOutput: "1\n2\n3\n4\n5\n6", isHidden: false },
    ],
    hints: [
      "Outer loop for rows",
      "Inner loop for columns",
      "arr[i][j] for each element"
    ],
    tags: ["2d-arrays", "nested-loops", "traversal"],
  },
  {
    title: "Sum 2D Array",
    slug: "sum-2d-array",
    type: "CODE",
    prompt: "Calculate and print the sum of all elements in the 2D array.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 5,
    points: 25,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        int[][] arr = {{1, 2, 3}, {4, 5, 6}};
        // Calculate and print sum

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int[][] arr = {{1, 2, 3}, {4, 5, 6}};
        int sum = 0;
        for (int[] row : arr) {
            for (int val : row) {
                sum += val;
            }
        }
        System.out.println(sum);
    }
}`,
    tests: [
      { input: "", expectedOutput: "21", isHidden: false },
    ],
    hints: [
      "Use nested enhanced for loops",
      "Add each element to sum",
      "1+2+3+4+5+6 = 21"
    ],
    tags: ["2d-arrays", "sum", "loops"],
  },
  {
    title: "Row Sum",
    slug: "row-sum",
    type: "CODE",
    prompt: "Print the sum of each row on separate lines.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 6,
    points: 30,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        int[][] arr = {{1, 2, 3}, {4, 5, 6}};
        // Print sum of each row

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int[][] arr = {{1, 2, 3}, {4, 5, 6}};
        for (int[] row : arr) {
            int sum = 0;
            for (int val : row) {
                sum += val;
            }
            System.out.println(sum);
        }
    }
}`,
    tests: [
      { input: "", expectedOutput: "6\n15", isHidden: false },
    ],
    hints: [
      "Reset sum for each row",
      "Sum all elements in current row",
      "Print after completing each row"
    ],
    tags: ["2d-arrays", "sum", "rows"],
  },
  {
    title: "Column Sum",
    slug: "column-sum",
    type: "CODE",
    prompt: "Print the sum of each column on separate lines.",
    constraints: null,
    difficulty: 3,
    estimatedMinutes: 7,
    points: 35,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        int[][] arr = {{1, 2, 3}, {4, 5, 6}};
        // Print sum of each column

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int[][] arr = {{1, 2, 3}, {4, 5, 6}};
        for (int j = 0; j < arr[0].length; j++) {
            int sum = 0;
            for (int i = 0; i < arr.length; i++) {
                sum += arr[i][j];
            }
            System.out.println(sum);
        }
    }
}`,
    tests: [
      { input: "", expectedOutput: "5\n7\n9", isHidden: false },
    ],
    hints: [
      "Outer loop for columns",
      "Inner loop for rows",
      "Column 0: 1+4=5, Column 1: 2+5=7, Column 2: 3+6=9"
    ],
    tags: ["2d-arrays", "sum", "columns"],
  },
  {
    title: "Find Maximum in 2D",
    slug: "find-max-2d",
    type: "CODE",
    prompt: "Find and print the maximum value in the 2D array.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 6,
    points: 30,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        int[][] arr = {{5, 2, 8}, {1, 9, 3}};
        // Find and print max

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int[][] arr = {{5, 2, 8}, {1, 9, 3}};
        int max = arr[0][0];
        for (int[] row : arr) {
            for (int val : row) {
                if (val > max) {
                    max = val;
                }
            }
        }
        System.out.println(max);
    }
}`,
    tests: [
      { input: "", expectedOutput: "9", isHidden: false },
    ],
    hints: [
      "Start with first element as max",
      "Compare all elements",
      "Update max when larger found"
    ],
    tags: ["2d-arrays", "max", "algorithm"],
  },
  {
    title: "Diagonal Sum",
    slug: "diagonal-sum",
    type: "CODE",
    prompt: "Calculate and print the sum of main diagonal elements (where row index equals column index).",
    constraints: "For square matrix.",
    difficulty: 3,
    estimatedMinutes: 6,
    points: 35,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        int[][] arr = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};
        // Sum main diagonal

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int[][] arr = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};
        int sum = 0;
        for (int i = 0; i < arr.length; i++) {
            sum += arr[i][i];
        }
        System.out.println(sum);
    }
}`,
    tests: [
      { input: "", expectedOutput: "15", isHidden: false },
    ],
    hints: [
      "Diagonal: arr[0][0], arr[1][1], arr[2][2]",
      "Row index equals column index",
      "1 + 5 + 9 = 15"
    ],
    tags: ["2d-arrays", "diagonal", "sum"],
  },
  {
    title: "Anti-Diagonal Sum",
    slug: "anti-diagonal-sum",
    type: "CODE",
    prompt: "Calculate and print the sum of anti-diagonal elements (from top-right to bottom-left).",
    constraints: null,
    difficulty: 3,
    estimatedMinutes: 7,
    points: 40,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        int[][] arr = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};
        // Sum anti-diagonal

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int[][] arr = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};
        int sum = 0;
        int n = arr.length;
        for (int i = 0; i < n; i++) {
            sum += arr[i][n - 1 - i];
        }
        System.out.println(sum);
    }
}`,
    tests: [
      { input: "", expectedOutput: "15", isHidden: false },
    ],
    hints: [
      "Anti-diagonal: arr[0][2], arr[1][1], arr[2][0]",
      "Column index = n - 1 - row",
      "3 + 5 + 7 = 15"
    ],
    tags: ["2d-arrays", "diagonal", "sum"],
  },
  {
    title: "Transpose Matrix",
    slug: "transpose-matrix",
    type: "CODE",
    prompt: "Print the transpose of the matrix (rows become columns).",
    constraints: null,
    difficulty: 3,
    estimatedMinutes: 8,
    points: 40,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        int[][] arr = {{1, 2, 3}, {4, 5, 6}};
        // Print transpose (3x2)

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int[][] arr = {{1, 2, 3}, {4, 5, 6}};
        for (int j = 0; j < arr[0].length; j++) {
            for (int i = 0; i < arr.length; i++) {
                System.out.print(arr[i][j]);
                if (i < arr.length - 1) System.out.print(" ");
            }
            System.out.println();
        }
    }
}`,
    tests: [
      { input: "", expectedOutput: "1 4\n2 5\n3 6", isHidden: false },
    ],
    hints: [
      "Swap row and column loops",
      "Original column becomes new row",
      "Print arr[i][j] where j is outer loop"
    ],
    tags: ["2d-arrays", "transpose", "matrix"],
  },
  {
    title: "Count Target in 2D",
    slug: "count-target-2d",
    type: "CODE",
    prompt: "Count how many times 5 appears in the 2D array.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 5,
    points: 25,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        int[][] arr = {{5, 2, 5}, {1, 5, 3}, {5, 4, 5}};
        // Count occurrences of 5

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int[][] arr = {{5, 2, 5}, {1, 5, 3}, {5, 4, 5}};
        int count = 0;
        for (int[] row : arr) {
            for (int val : row) {
                if (val == 5) {
                    count++;
                }
            }
        }
        System.out.println(count);
    }
}`,
    tests: [
      { input: "", expectedOutput: "5", isHidden: false },
    ],
    hints: [
      "Check each element",
      "Increment count when equals 5",
      "5 appears 5 times"
    ],
    tags: ["2d-arrays", "count", "search"],
  },
  {
    title: "Border Sum",
    slug: "border-sum",
    type: "CODE",
    prompt: "Calculate the sum of all border elements (first/last row and first/last column).",
    constraints: null,
    difficulty: 3,
    estimatedMinutes: 8,
    points: 40,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        int[][] arr = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};
        // Sum border elements

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int[][] arr = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};
        int sum = 0;
        int rows = arr.length;
        int cols = arr[0].length;
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                if (i == 0 || i == rows - 1 || j == 0 || j == cols - 1) {
                    sum += arr[i][j];
                }
            }
        }
        System.out.println(sum);
    }
}`,
    tests: [
      { input: "", expectedOutput: "40", isHidden: false },
    ],
    hints: [
      "Border: first row, last row, first col, last col",
      "Check if i or j is at boundary",
      "1+2+3+4+6+7+8+9 = 40 (5 is not border)"
    ],
    tags: ["2d-arrays", "border", "sum"],
  },
  {
    title: "Row with Max Sum",
    slug: "row-max-sum",
    type: "CODE",
    prompt: "Find and print the index of the row with the maximum sum.",
    constraints: null,
    difficulty: 3,
    estimatedMinutes: 8,
    points: 40,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        int[][] arr = {{1, 2, 3}, {10, 20, 30}, {4, 5, 6}};
        // Find row index with max sum

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int[][] arr = {{1, 2, 3}, {10, 20, 30}, {4, 5, 6}};
        int maxSum = Integer.MIN_VALUE;
        int maxRow = 0;
        for (int i = 0; i < arr.length; i++) {
            int rowSum = 0;
            for (int val : arr[i]) {
                rowSum += val;
            }
            if (rowSum > maxSum) {
                maxSum = rowSum;
                maxRow = i;
            }
        }
        System.out.println(maxRow);
    }
}`,
    tests: [
      { input: "", expectedOutput: "1", isHidden: false },
    ],
    hints: [
      "Calculate sum for each row",
      "Track maximum sum and its row index",
      "Row 1 has sum 60, which is max"
    ],
    tags: ["2d-arrays", "max", "rows"],
  },
  {
    title: "Multiply 2D by Scalar",
    slug: "multiply-2d-scalar",
    type: "CODE",
    prompt: "Multiply all elements by 2 and print the first element.",
    constraints: "Modify in place.",
    difficulty: 2,
    estimatedMinutes: 5,
    points: 25,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        int[][] arr = {{1, 2}, {3, 4}};
        // Multiply all by 2

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int[][] arr = {{1, 2}, {3, 4}};
        for (int i = 0; i < arr.length; i++) {
            for (int j = 0; j < arr[i].length; j++) {
                arr[i][j] *= 2;
            }
        }
        System.out.println(arr[0][0]);
    }
}`,
    tests: [
      { input: "", expectedOutput: "2", isHidden: false },
    ],
    hints: [
      "Need index-based loop to modify",
      "arr[i][j] *= 2",
      "First element becomes 2"
    ],
    tags: ["2d-arrays", "modification", "scalar"],
  },
  {
    title: "Check Sorted Rows",
    slug: "check-sorted-rows",
    type: "CODE",
    prompt: "Check if all rows are sorted in ascending order. Print true or false.",
    constraints: null,
    difficulty: 3,
    estimatedMinutes: 8,
    points: 40,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        int[][] arr = {{1, 2, 3}, {4, 5, 6}};
        // Check if all rows sorted

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int[][] arr = {{1, 2, 3}, {4, 5, 6}};
        boolean allSorted = true;
        outer:
        for (int[] row : arr) {
            for (int j = 1; j < row.length; j++) {
                if (row[j] < row[j - 1]) {
                    allSorted = false;
                    break outer;
                }
            }
        }
        System.out.println(allSorted);
    }
}`,
    tests: [
      { input: "", expectedOutput: "true", isHidden: false },
    ],
    hints: [
      "Compare adjacent elements in each row",
      "If any out of order, not sorted",
      "Both rows are sorted ascending"
    ],
    tags: ["2d-arrays", "sorted", "validation"],
  },
  {
    title: "Matrix Addition",
    slug: "matrix-addition",
    type: "CODE",
    prompt: "Add two matrices element by element and print element [0][0] of the result.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 6,
    points: 30,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        int[][] a = {{1, 2}, {3, 4}};
        int[][] b = {{5, 6}, {7, 8}};
        // Add matrices, print result[0][0]

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int[][] a = {{1, 2}, {3, 4}};
        int[][] b = {{5, 6}, {7, 8}};
        int[][] result = new int[2][2];
        for (int i = 0; i < 2; i++) {
            for (int j = 0; j < 2; j++) {
                result[i][j] = a[i][j] + b[i][j];
            }
        }
        System.out.println(result[0][0]);
    }
}`,
    tests: [
      { input: "", expectedOutput: "6", isHidden: false },
    ],
    hints: [
      "Add corresponding elements",
      "result[i][j] = a[i][j] + b[i][j]",
      "1 + 5 = 6"
    ],
    tags: ["2d-arrays", "matrix", "addition"],
  },
  {
    title: "Identity Check",
    slug: "identity-check",
    type: "CODE",
    prompt: "Check if the matrix is an identity matrix (1s on diagonal, 0s elsewhere).",
    constraints: null,
    difficulty: 3,
    estimatedMinutes: 8,
    points: 45,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        int[][] arr = {{1, 0, 0}, {0, 1, 0}, {0, 0, 1}};
        // Check if identity matrix

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int[][] arr = {{1, 0, 0}, {0, 1, 0}, {0, 0, 1}};
        boolean isIdentity = true;
        for (int i = 0; i < arr.length && isIdentity; i++) {
            for (int j = 0; j < arr[i].length && isIdentity; j++) {
                if (i == j) {
                    if (arr[i][j] != 1) isIdentity = false;
                } else {
                    if (arr[i][j] != 0) isIdentity = false;
                }
            }
        }
        System.out.println(isIdentity);
    }
}`,
    tests: [
      { input: "", expectedOutput: "true", isHidden: false },
    ],
    hints: [
      "Diagonal elements (i==j) should be 1",
      "Non-diagonal elements should be 0",
      "Check all elements"
    ],
    tags: ["2d-arrays", "identity", "matrix"],
  },
  {
    title: "Flatten 2D to 1D",
    slug: "flatten-2d",
    type: "CODE",
    prompt: "Flatten the 2D array to 1D and print all elements on one line, space-separated.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 6,
    points: 30,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        int[][] arr = {{1, 2}, {3, 4}};
        // Flatten and print

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int[][] arr = {{1, 2}, {3, 4}};
        StringBuilder sb = new StringBuilder();
        for (int[] row : arr) {
            for (int val : row) {
                if (sb.length() > 0) sb.append(" ");
                sb.append(val);
            }
        }
        System.out.println(sb.toString());
    }
}`,
    tests: [
      { input: "", expectedOutput: "1 2 3 4", isHidden: false },
    ],
    hints: [
      "Traverse all elements",
      "Build a single line output",
      "Add space between elements"
    ],
    tags: ["2d-arrays", "flatten"],
  },
  {
    title: "PageRank-Style Update",
    slug: "pagerank-update",
    type: "CODE",
    prompt: "Given an adjacency matrix, calculate the sum of incoming links for node 0 (column 0 sum).",
    constraints: "This simulates PageRank's link counting.",
    difficulty: 3,
    estimatedMinutes: 7,
    points: 40,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // Adjacency matrix: links[i][j]=1 means page i links to page j
        int[][] links = {{0, 1, 1}, {1, 0, 0}, {1, 1, 0}};
        // Count incoming links to node 0 (sum of column 0)

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int[][] links = {{0, 1, 1}, {1, 0, 0}, {1, 1, 0}};
        int incoming = 0;
        for (int i = 0; i < links.length; i++) {
            incoming += links[i][0];
        }
        System.out.println(incoming);
    }
}`,
    tests: [
      { input: "", expectedOutput: "2", isHidden: false },
    ],
    hints: [
      "Column sum = incoming links",
      "Sum all links[i][0]",
      "Nodes 1 and 2 link to node 0"
    ],
    tags: ["2d-arrays", "pagerank", "algorithm"],
  },
  {
    title: "Outgoing Links Count",
    slug: "outgoing-links",
    type: "CODE",
    prompt: "For the adjacency matrix, calculate outgoing links from node 0 (row 0 sum).",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 5,
    points: 25,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        int[][] links = {{0, 1, 1}, {1, 0, 0}, {1, 1, 0}};
        // Count outgoing links from node 0 (row 0 sum)

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int[][] links = {{0, 1, 1}, {1, 0, 0}, {1, 1, 0}};
        int outgoing = 0;
        for (int j = 0; j < links[0].length; j++) {
            outgoing += links[0][j];
        }
        System.out.println(outgoing);
    }
}`,
    tests: [
      { input: "", expectedOutput: "2", isHidden: false },
    ],
    hints: [
      "Row sum = outgoing links",
      "Sum all links[0][j]",
      "Node 0 links to nodes 1 and 2"
    ],
    tags: ["2d-arrays", "pagerank", "rows"],
  },

  // ===== Topic 17: Standard I/O (15 questions) =====
  {
    title: "Read Integer Input",
    slug: "read-integer-input",
    type: "CODE",
    prompt: "Read an integer from standard input and print its double.",
    constraints: "Use Scanner.",
    difficulty: 2,
    estimatedMinutes: 5,
    points: 25,
    starterCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        // Read integer and print double

    }
}`,
    solutionCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        System.out.println(n * 2);
    }
}`,
    tests: [
      { input: "5", expectedOutput: "10", isHidden: false },
      { input: "7", expectedOutput: "14", isHidden: true },
    ],
    hints: [
      "Use scanner.nextInt()",
      "Multiply by 2",
      "Print the result"
    ],
    tags: ["io", "Scanner", "input"],
  },
  {
    title: "Read Two Integers",
    slug: "read-two-integers",
    type: "CODE",
    prompt: "Read two integers and print their sum.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 5,
    points: 25,
    starterCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        // Read two integers and print sum

    }
}`,
    solutionCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int a = scanner.nextInt();
        int b = scanner.nextInt();
        System.out.println(a + b);
    }
}`,
    tests: [
      { input: "3 5", expectedOutput: "8", isHidden: false },
      { input: "10 20", expectedOutput: "30", isHidden: true },
    ],
    hints: [
      "Call nextInt() twice",
      "Add the two values",
      "Print the sum"
    ],
    tags: ["io", "Scanner", "input"],
  },
  {
    title: "Read String Input",
    slug: "read-string-input",
    type: "CODE",
    prompt: "Read a single word and print it in uppercase.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 4,
    points: 20,
    starterCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        // Read word and print uppercase

    }
}`,
    solutionCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String word = scanner.next();
        System.out.println(word.toUpperCase());
    }
}`,
    tests: [
      { input: "hello", expectedOutput: "HELLO", isHidden: false },
      { input: "Java", expectedOutput: "JAVA", isHidden: true },
    ],
    hints: [
      "Use scanner.next() for single word",
      "Apply toUpperCase()",
      "Print the result"
    ],
    tags: ["io", "Scanner", "String"],
  },
  {
    title: "Read Line Input",
    slug: "read-line-input",
    type: "CODE",
    prompt: "Read a full line of text and print its length.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 4,
    points: 25,
    starterCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        // Read line and print length

    }
}`,
    solutionCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine();
        System.out.println(line.length());
    }
}`,
    tests: [
      { input: "Hello World", expectedOutput: "11", isHidden: false },
      { input: "Java Programming", expectedOutput: "16", isHidden: true },
    ],
    hints: [
      "Use scanner.nextLine() for full line",
      "Get length of the line",
      "Spaces are included"
    ],
    tags: ["io", "Scanner", "String"],
  },
  {
    title: "Read Double Input",
    slug: "read-double-input",
    type: "CODE",
    prompt: "Read a double value and print its square.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 4,
    points: 20,
    starterCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        // Read double and print square

    }
}`,
    solutionCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        double n = scanner.nextDouble();
        System.out.println(n * n);
    }
}`,
    tests: [
      { input: "3.0", expectedOutput: "9.0", isHidden: false },
      { input: "2.5", expectedOutput: "6.25", isHidden: true },
    ],
    hints: [
      "Use scanner.nextDouble()",
      "Multiply by itself for square",
      "Print the result"
    ],
    tags: ["io", "Scanner", "double"],
  },
  {
    title: "Multiple Line Input",
    slug: "multiple-line-input",
    type: "CODE",
    prompt: "Read N (first line), then read N integers and print their sum.",
    constraints: null,
    difficulty: 3,
    estimatedMinutes: 7,
    points: 35,
    starterCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        // Read N, then N numbers, print sum

    }
}`,
    solutionCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int sum = 0;
        for (int i = 0; i < n; i++) {
            sum += scanner.nextInt();
        }
        System.out.println(sum);
    }
}`,
    tests: [
      { input: "3\n1 2 3", expectedOutput: "6", isHidden: false },
      { input: "4\n10 20 30 40", expectedOutput: "100", isHidden: true },
    ],
    hints: [
      "First read the count N",
      "Loop N times to read values",
      "Sum as you go"
    ],
    tags: ["io", "Scanner", "loops"],
  },
  {
    title: "Read Until Zero",
    slug: "read-until-zero",
    type: "CODE",
    prompt: "Keep reading integers until 0 is entered. Print the sum of all non-zero values.",
    constraints: null,
    difficulty: 3,
    estimatedMinutes: 7,
    points: 35,
    starterCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        // Read until 0, sum non-zero values

    }
}`,
    solutionCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int sum = 0;
        int num;
        while ((num = scanner.nextInt()) != 0) {
            sum += num;
        }
        System.out.println(sum);
    }
}`,
    tests: [
      { input: "1 2 3 0", expectedOutput: "6", isHidden: false },
      { input: "5 10 15 0", expectedOutput: "30", isHidden: true },
    ],
    hints: [
      "Use while loop with condition",
      "Stop when 0 is read",
      "Don't add 0 to sum"
    ],
    tags: ["io", "Scanner", "while-loop"],
  },
  {
    title: "Check Has Next",
    slug: "check-has-next",
    type: "CODE",
    prompt: "Read all integers until end of input and print their count.",
    constraints: "Use hasNextInt().",
    difficulty: 3,
    estimatedMinutes: 6,
    points: 30,
    starterCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        // Count all integers in input

    }
}`,
    solutionCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int count = 0;
        while (scanner.hasNextInt()) {
            scanner.nextInt();
            count++;
        }
        System.out.println(count);
    }
}`,
    tests: [
      { input: "1 2 3 4 5", expectedOutput: "5", isHidden: false },
      { input: "10 20", expectedOutput: "2", isHidden: true },
    ],
    hints: [
      "hasNextInt() checks if more input exists",
      "Count each integer read",
      "Stop when no more integers"
    ],
    tags: ["io", "Scanner", "hasNext"],
  },
  {
    title: "Read Array from Input",
    slug: "read-array-input",
    type: "CODE",
    prompt: "Read N (first line), then N integers into an array. Print the maximum.",
    constraints: null,
    difficulty: 3,
    estimatedMinutes: 8,
    points: 40,
    starterCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        // Read array, print max

    }
}`,
    solutionCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = scanner.nextInt();
        }
        int max = arr[0];
        for (int i = 1; i < n; i++) {
            if (arr[i] > max) max = arr[i];
        }
        System.out.println(max);
    }
}`,
    tests: [
      { input: "5\n3 1 4 1 5", expectedOutput: "5", isHidden: false },
      { input: "3\n10 20 15", expectedOutput: "20", isHidden: true },
    ],
    hints: [
      "First read array size",
      "Create array and fill it",
      "Find maximum value"
    ],
    tags: ["io", "Scanner", "arrays", "max"],
  },
  {
    title: "Read 2D Array",
    slug: "read-2d-array",
    type: "CODE",
    prompt: "Read rows and cols, then a 2D array. Print the sum of all elements.",
    constraints: null,
    difficulty: 3,
    estimatedMinutes: 10,
    points: 50,
    starterCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        // Read 2D array dimensions and values, print sum

    }
}`,
    solutionCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int rows = scanner.nextInt();
        int cols = scanner.nextInt();
        int[][] arr = new int[rows][cols];
        int sum = 0;
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                arr[i][j] = scanner.nextInt();
                sum += arr[i][j];
            }
        }
        System.out.println(sum);
    }
}`,
    tests: [
      { input: "2 3\n1 2 3 4 5 6", expectedOutput: "21", isHidden: false },
      { input: "2 2\n1 2 3 4", expectedOutput: "10", isHidden: true },
    ],
    hints: [
      "Read rows and cols first",
      "Create 2D array",
      "Sum while reading values"
    ],
    tags: ["io", "Scanner", "2d-arrays"],
  },
  {
    title: "Formatted Output",
    slug: "formatted-output",
    type: "CODE",
    prompt: "Read an integer and print it with leading zeros to make 5 digits.",
    constraints: "Use printf with format specifier.",
    difficulty: 2,
    estimatedMinutes: 5,
    points: 25,
    starterCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        // Print with leading zeros (5 digits)

    }
}`,
    solutionCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        System.out.printf("%05d%n", n);
    }
}`,
    tests: [
      { input: "42", expectedOutput: "00042", isHidden: false },
      { input: "123", expectedOutput: "00123", isHidden: true },
    ],
    hints: [
      "Use printf for formatting",
      "%05d means 5 digits with leading zeros",
      "%n adds a newline"
    ],
    tags: ["io", "printf", "formatting"],
  },
  {
    title: "Decimal Formatting",
    slug: "decimal-formatting",
    type: "CODE",
    prompt: "Read a double and print it with exactly 2 decimal places.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 5,
    points: 25,
    starterCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        double n = scanner.nextDouble();
        // Print with 2 decimal places

    }
}`,
    solutionCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        double n = scanner.nextDouble();
        System.out.printf("%.2f%n", n);
    }
}`,
    tests: [
      { input: "3.14159", expectedOutput: "3.14", isHidden: false },
      { input: "2.5", expectedOutput: "2.50", isHidden: true },
    ],
    hints: [
      "Use printf with %.2f",
      ".2 means 2 decimal places",
      "f is for floating point"
    ],
    tags: ["io", "printf", "formatting"],
  },

  // ===== Topic 18: Final Keyword (10 questions) =====
  {
    title: "Declare Constant",
    slug: "declare-constant",
    type: "CODE",
    prompt: "Declare a final constant PI = 3.14159 and print it.",
    constraints: "Use final keyword.",
    difficulty: 1,
    estimatedMinutes: 3,
    points: 15,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // Declare final PI and print

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        final double PI = 3.14159;
        System.out.println(PI);
    }
}`,
    tests: [
      { input: "", expectedOutput: "3.14159", isHidden: false },
    ],
    hints: [
      "Use final double PI = value",
      "Constants are often ALL_CAPS",
      "final means it can't be changed"
    ],
    tags: ["final", "constants"],
  },
  {
    title: "Use Constant in Calculation",
    slug: "use-constant-calculation",
    type: "CODE",
    prompt: "Calculate and print the circumference of a circle with radius 5 using final PI = 3.14159.",
    constraints: "Circumference = 2 * PI * radius",
    difficulty: 2,
    estimatedMinutes: 4,
    points: 20,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        final double PI = 3.14159;
        int radius = 5;
        // Calculate and print circumference

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        final double PI = 3.14159;
        int radius = 5;
        double circumference = 2 * PI * radius;
        System.out.println(circumference);
    }
}`,
    tests: [
      { input: "", expectedOutput: "31.4159", isHidden: false },
    ],
    hints: [
      "Formula: 2 * PI * r",
      "Use the declared constant",
      "2 * 3.14159 * 5 = 31.4159"
    ],
    tags: ["final", "math", "calculation"],
  },
  {
    title: "Final Array Reference",
    slug: "final-array-reference",
    type: "CODE",
    prompt: "Create a final array reference. Show that you can still modify elements by changing first element to 100.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 5,
    points: 25,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        final int[] arr = {1, 2, 3};
        // Modify first element to 100 and print

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        final int[] arr = {1, 2, 3};
        arr[0] = 100;
        System.out.println(arr[0]);
    }
}`,
    tests: [
      { input: "", expectedOutput: "100", isHidden: false },
    ],
    hints: [
      "final applies to the reference, not contents",
      "You can still modify array elements",
      "You just can't reassign arr to a new array"
    ],
    tags: ["final", "arrays", "reference"],
  },
  {
    title: "Multiple Constants",
    slug: "multiple-constants",
    type: "CODE",
    prompt: "Declare final constants for DAYS_IN_WEEK = 7 and HOURS_IN_DAY = 24. Print hours in a week.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 4,
    points: 20,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // Declare constants and calculate hours in week

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        final int DAYS_IN_WEEK = 7;
        final int HOURS_IN_DAY = 24;
        System.out.println(DAYS_IN_WEEK * HOURS_IN_DAY);
    }
}`,
    tests: [
      { input: "", expectedOutput: "168", isHidden: false },
    ],
    hints: [
      "Declare both as final int",
      "Multiply them together",
      "7 * 24 = 168"
    ],
    tags: ["final", "constants", "calculation"],
  },
  {
    title: "Final String Constant",
    slug: "final-string-constant",
    type: "CODE",
    prompt: "Declare a final String GREETING = \"Hello\" and use it to print \"Hello, World!\".",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 4,
    points: 20,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // Declare final GREETING and print with World

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        final String GREETING = "Hello";
        System.out.println(GREETING + ", World!");
    }
}`,
    tests: [
      { input: "", expectedOutput: "Hello, World!", isHidden: false },
    ],
    hints: [
      "Declare final String GREETING",
      "Concatenate with \", World!\"",
      "Print the result"
    ],
    tags: ["final", "String", "constants"],
  },
  {
    title: "Constant in Loop",
    slug: "constant-in-loop",
    type: "CODE",
    prompt: "Use final MAX_ITERATIONS = 3 to control a loop. Print numbers 1 to MAX_ITERATIONS.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 5,
    points: 25,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        final int MAX_ITERATIONS = 3;
        // Loop using constant

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        final int MAX_ITERATIONS = 3;
        for (int i = 1; i <= MAX_ITERATIONS; i++) {
            System.out.println(i);
        }
    }
}`,
    tests: [
      { input: "", expectedOutput: "1\n2\n3", isHidden: false },
    ],
    hints: [
      "Use the constant in loop condition",
      "i <= MAX_ITERATIONS",
      "Constants make code more readable"
    ],
    tags: ["final", "loops", "constants"],
  },
  {
    title: "Class-Level Constant",
    slug: "class-level-constant",
    type: "CODE",
    prompt: "Declare a static final constant at class level and use it in main to print.",
    constraints: "Use static final.",
    difficulty: 2,
    estimatedMinutes: 5,
    points: 25,
    starterCode: `public class Solution {
    // Declare static final constant here


    public static void main(String[] args) {
        // Print the constant

    }
}`,
    solutionCode: `public class Solution {
    static final int MAX_SIZE = 100;

    public static void main(String[] args) {
        System.out.println(MAX_SIZE);
    }
}`,
    tests: [
      { input: "", expectedOutput: "100", isHidden: false },
    ],
    hints: [
      "static final at class level",
      "Access directly in main",
      "Convention: ALL_CAPS for constants"
    ],
    tags: ["final", "static", "class-level"],
  },
  {
    title: "Calculate Area with Constant",
    slug: "area-with-constant",
    type: "CODE",
    prompt: "Calculate area of a circle with radius 7 using final PI = 3.14159. Print rounded to 2 decimal places.",
    constraints: "Area = PI * r * r",
    difficulty: 2,
    estimatedMinutes: 5,
    points: 25,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        final double PI = 3.14159;
        int radius = 7;
        // Calculate and print area with 2 decimals

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        final double PI = 3.14159;
        int radius = 7;
        double area = PI * radius * radius;
        System.out.printf("%.2f%n", area);
    }
}`,
    tests: [
      { input: "", expectedOutput: "153.94", isHidden: false },
    ],
    hints: [
      "Area = PI * r^2",
      "Use printf for formatting",
      "3.14159 * 49 ≈ 153.94"
    ],
    tags: ["final", "math", "printf"],
  },
  {
    title: "Boolean Constant",
    slug: "boolean-constant",
    type: "CODE",
    prompt: "Declare final boolean DEBUG = true. If DEBUG is true, print \"Debug mode on\".",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 4,
    points: 20,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // Declare DEBUG constant and check

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        final boolean DEBUG = true;
        if (DEBUG) {
            System.out.println("Debug mode on");
        }
    }
}`,
    tests: [
      { input: "", expectedOutput: "Debug mode on", isHidden: false },
    ],
    hints: [
      "Declare final boolean DEBUG",
      "Use in if condition",
      "Boolean constants control features"
    ],
    tags: ["final", "boolean", "conditionals"],
  },
  {
    title: "Tax Calculation Constant",
    slug: "tax-calculation-constant",
    type: "CODE",
    prompt: "Calculate tax on $100 using final TAX_RATE = 0.08. Print the tax amount.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 4,
    points: 20,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        final double TAX_RATE = 0.08;
        double price = 100.0;
        // Calculate and print tax

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        final double TAX_RATE = 0.08;
        double price = 100.0;
        double tax = price * TAX_RATE;
        System.out.println(tax);
    }
}`,
    tests: [
      { input: "", expectedOutput: "8.0", isHidden: false },
    ],
    hints: [
      "Tax = price * rate",
      "100 * 0.08 = 8.0",
      "Constants make rates easy to change"
    ],
    tags: ["final", "math", "calculation"],
  },
]
