package com.neurox;

import com.neurox.entity.Unit;
import com.neurox.entity.UnitQuiz;
import com.neurox.repository.UnitQuizRepository;
import com.neurox.repository.UnitRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
@Order(2)
public class CourseDataLoader implements CommandLineRunner {

    private static final String DSA = "dsa-course";

    private final UnitRepository unitRepo;
    private final UnitQuizRepository quizRepo;

    public CourseDataLoader(UnitRepository unitRepo, UnitQuizRepository quizRepo) {
        this.unitRepo = unitRepo;
        this.quizRepo = quizRepo;
    }

    @Override
    public void run(String... args) {
        if (unitRepo.existsByCourseId(DSA)) return;
        loadDSACourse();
    }

    private void loadDSACourse() {
        // ── BIG O (units 1-5) ──────────────────────────────────────────────
        u(1,  "What is Big O Notation?",           "Big O",        "https://www.youtube.com/watch?v=D6xkbGLQesk", 8,  "beginner");
        u(2,  "O(1) and O(n) Examples",            "Big O",        "https://www.youtube.com/watch?v=itn09C2ZB9Y", 7,  "beginner");
        u(3,  "O(n²) and Nested Loops",            "Big O",        "https://www.youtube.com/watch?v=RGuJga2nl_E", 6,  "beginner");
        u(4,  "O(log n) — Binary Search Intro",    "Big O",        "https://www.youtube.com/watch?v=6ysjqCUv7K4", 7,  "beginner");
        u(5,  "Space Complexity Basics",            "Big O",        "https://www.youtube.com/watch?v=yOb0BL-84h8", 6,  "beginner");

        // ── ARRAYS (units 6-12) ────────────────────────────────────────────
        u(6,  "Arrays Introduction",               "Arrays",       "https://www.youtube.com/watch?v=QJNwK2uJyGs", 7,  "beginner");
        u(7,  "Array Traversal & Access",          "Arrays",       "https://www.youtube.com/watch?v=gDqQf4Ekr2A", 6,  "beginner");
        u(8,  "Array Insertion & Deletion",        "Arrays",       "https://www.youtube.com/watch?v=HJ8Vl4BKQKI", 8,  "beginner");
        u(9,  "Two Pointer Technique",             "Arrays",       "https://www.youtube.com/watch?v=On03HWe2tZM", 9,  "intermediate");
        u(10, "Sliding Window Pattern",            "Arrays",       "https://www.youtube.com/watch?v=MK-NZ4hN7rs", 10, "intermediate");
        u(11, "Prefix Sum Array",                  "Arrays",       "https://www.youtube.com/watch?v=pVS3yhlzrlQ", 8,  "intermediate");
        u(12, "Array Problems: Kadane's Algorithm","Arrays",       "https://www.youtube.com/watch?v=86CQq3pKSUw", 9,  "intermediate");

        // ── STRINGS (units 13-16) ──────────────────────────────────────────
        u(13, "String Basics & Immutability",      "Strings",      "https://www.youtube.com/watch?v=Dj5hzKSk4uw", 6,  "beginner");
        u(14, "String Reversal & Palindrome",      "Strings",      "https://www.youtube.com/watch?v=X7CXjKGi_ro", 7,  "beginner");
        u(15, "Anagram & Frequency Count",         "Strings",      "https://www.youtube.com/watch?v=9UtInBqnCgA", 8,  "intermediate");
        u(16, "Substring Search (KMP Intro)",      "Strings",      "https://www.youtube.com/watch?v=GTJr8OvyEVQ", 9,  "advanced");

        // ── LINKED LIST (units 17-22) ──────────────────────────────────────
        u(17, "Linked List Introduction",          "LinkedList",   "https://www.youtube.com/watch?v=WwfhLC16bis", 8,  "beginner");
        u(18, "Singly Linked List Operations",     "LinkedList",   "https://www.youtube.com/watch?v=njTh_OwMljA", 9,  "beginner");
        u(19, "Doubly Linked List",                "LinkedList",   "https://www.youtube.com/watch?v=e9NG_a2Z0e8", 8,  "intermediate");
        u(20, "Linked List Reversal",              "LinkedList",   "https://www.youtube.com/watch?v=G0_I-ZF0S38", 7,  "intermediate");
        u(21, "Detect Cycle in Linked List",       "LinkedList",   "https://www.youtube.com/watch?v=gBTe7lFR3vc", 8,  "intermediate");
        u(22, "Merge Two Sorted Lists",            "LinkedList",   "https://www.youtube.com/watch?v=XIdigk956u0", 9,  "intermediate");

        // ── STACKS (units 23-26) ───────────────────────────────────────────
        u(23, "Stack Introduction & LIFO",         "Stacks",       "https://www.youtube.com/watch?v=wjI1WNcIntg", 7,  "beginner");
        u(24, "Stack Using Array",                 "Stacks",       "https://www.youtube.com/watch?v=sFVxsglODoo", 7,  "beginner");
        u(25, "Balanced Parentheses Problem",      "Stacks",       "https://www.youtube.com/watch?v=VHm9R6UT-dA", 8,  "intermediate");
        u(26, "Monotonic Stack Pattern",           "Stacks",       "https://www.youtube.com/watch?v=Dq_ObZwTY_Q", 9,  "advanced");

        // ── QUEUES (units 27-29) ───────────────────────────────────────────
        u(27, "Queue Introduction & FIFO",         "Queues",       "https://www.youtube.com/watch?v=XuCbpw6Bj1U", 7,  "beginner");
        u(28, "Circular Queue",                    "Queues",       "https://www.youtube.com/watch?v=dn01XST9-bI", 8,  "intermediate");
        u(29, "Deque & Sliding Window Maximum",    "Queues",       "https://www.youtube.com/watch?v=A5_XdiK4J8A", 9,  "advanced");

        // ── SORTING (units 30-35) ──────────────────────────────────────────
        u(30, "Bubble Sort",                       "Sorting",      "https://www.youtube.com/watch?v=xli_FI7CuzA", 6,  "beginner");
        u(31, "Selection & Insertion Sort",        "Sorting",      "https://www.youtube.com/watch?v=lx9G71uLXIg", 7,  "beginner");
        u(32, "Merge Sort",                        "Sorting",      "https://www.youtube.com/watch?v=4VqmGXwpLqc", 9,  "intermediate");
        u(33, "Quick Sort",                        "Sorting",      "https://www.youtube.com/watch?v=Hoixgm4-P4M", 9,  "intermediate");
        u(34, "Heap Sort",                         "Sorting",      "https://www.youtube.com/watch?v=2DmK_H7IdTo", 8,  "intermediate");
        u(35, "Counting & Radix Sort",             "Sorting",      "https://www.youtube.com/watch?v=OKd534EWcdk", 8,  "advanced");

        // ── SEARCHING (units 36-38) ────────────────────────────────────────
        u(36, "Linear Search",                     "Searching",    "https://www.youtube.com/watch?v=C46QfTjVCNU", 5,  "beginner");
        u(37, "Binary Search",                     "Searching",    "https://www.youtube.com/watch?v=P3YID7liBug", 8,  "beginner");
        u(38, "Binary Search on Answer",           "Searching",    "https://www.youtube.com/watch?v=_nCsPn7_OgI", 9,  "advanced");

        // ── TREES (units 39-45) ────────────────────────────────────────────
        u(39, "Binary Tree Introduction",          "Trees",        "https://www.youtube.com/watch?v=oSWTXtMglKE", 8,  "beginner");
        u(40, "Tree Traversals (In/Pre/Post)",     "Trees",        "https://www.youtube.com/watch?v=BHB0B1jFKQc", 9,  "beginner");
        u(41, "Binary Search Tree (BST)",          "Trees",        "https://www.youtube.com/watch?v=pYT9F8_LFTM", 9,  "intermediate");
        u(42, "BST Insert, Delete, Search",        "Trees",        "https://www.youtube.com/watch?v=wcIRPqTR3Kc", 9,  "intermediate");
        u(43, "Tree Height & Diameter",            "Trees",        "https://www.youtube.com/watch?v=Rezetez59Nk", 8,  "intermediate");
        u(44, "Level Order Traversal (BFS)",       "Trees",        "https://www.youtube.com/watch?v=6ZnyEApgFYg", 9,  "intermediate");
        u(45, "AVL Trees & Balancing",             "Trees",        "https://www.youtube.com/watch?v=jDM6_TnYIqE", 10, "advanced");

        // ── HEAPS (units 46-48) ────────────────────────────────────────────
        u(46, "Heap Introduction & Min/Max Heap",  "Heaps",        "https://www.youtube.com/watch?v=t0Cq6tVNRBA", 8,  "intermediate");
        u(47, "Heap Insert & Extract",             "Heaps",        "https://www.youtube.com/watch?v=HqPJF2L5h9U", 8,  "intermediate");
        u(48, "Top K Elements Pattern",            "Heaps",        "https://www.youtube.com/watch?v=YPTqKIgVk-k", 9,  "advanced");

        // ── GRAPHS (units 49-54) ───────────────────────────────────────────
        u(49, "Graph Introduction",                "Graphs",       "https://www.youtube.com/watch?v=tWVWeAqZ0WU", 8,  "beginner");
        u(50, "BFS on Graphs",                     "Graphs",       "https://www.youtube.com/watch?v=oDqjPvD1Hkk", 9,  "intermediate");
        u(51, "DFS on Graphs",                     "Graphs",       "https://www.youtube.com/watch?v=7fujbpJ0LB4", 9,  "intermediate");
        u(52, "Detect Cycle in Graph",             "Graphs",       "https://www.youtube.com/watch?v=0dJmTuMrUZM", 9,  "intermediate");
        u(53, "Topological Sort",                  "Graphs",       "https://www.youtube.com/watch?v=eL10SIlSYOs", 10, "advanced");
        u(54, "Dijkstra's Shortest Path",          "Graphs",       "https://www.youtube.com/watch?v=GazC3A4OQTE", 10, "advanced");

        loadQuizzes();
    }

    // ── QUIZ DATA ─────────────────────────────────────────────────────────────

    private void loadQuizzes() {
        // Big O
        quiz("Big O Notation?",
            list("Measures algorithm efficiency","Measures memory size","Measures code length","Measures CPU speed"),
            "Measures algorithm efficiency", "Big O");
        quiz("O(1) means?",
            list("Constant time","Linear time","Quadratic time","Logarithmic time"),
            "Constant time", "Big O");
        quiz("O(n) means?",
            list("Constant time","Linear time","Quadratic time","Logarithmic time"),
            "Linear time", "Big O");
        quiz("Binary search is?",
            list("O(n)","O(n²)","O(log n)","O(1)"),
            "O(log n)", "Big O");
        quiz("Nested loop over n elements is?",
            list("O(n)","O(n²)","O(log n)","O(1)"),
            "O(n²)", "Big O");

        // Arrays
        quiz("Array access by index is?",
            list("O(1)","O(n)","O(log n)","O(n²)"),
            "O(1)", "Arrays");
        quiz("Inserting at beginning of array is?",
            list("O(1)","O(n)","O(log n)","O(n²)"),
            "O(n)", "Arrays");
        quiz("Two pointer technique is used for?",
            list("Sorting","Searching pairs in sorted array","Graph traversal","Tree traversal"),
            "Searching pairs in sorted array", "Arrays");
        quiz("Sliding window is best for?",
            list("Finding max subarray of fixed size","Sorting","Graph BFS","Tree DFS"),
            "Finding max subarray of fixed size", "Arrays");
        quiz("Kadane's algorithm finds?",
            list("Maximum subarray sum","Minimum element","Sorted order","Duplicate elements"),
            "Maximum subarray sum", "Arrays");

        // Strings
        quiz("Strings in Java are?",
            list("Mutable","Immutable","Primitive","None"),
            "Immutable", "Strings");
        quiz("Palindrome check requires?",
            list("Sorting","Two pointers","Stack","Queue"),
            "Two pointers", "Strings");
        quiz("Anagram check uses?",
            list("Frequency count","Sorting only","Two pointers","Graph"),
            "Frequency count", "Strings");
        quiz("KMP algorithm is used for?",
            list("Sorting","Pattern matching in strings","Graph traversal","Tree search"),
            "Pattern matching in strings", "Strings");
        quiz("String concatenation in loop is?",
            list("O(1)","O(n)","O(n²)","O(log n)"),
            "O(n²)", "Strings");

        // Linked List
        quiz("Linked list node contains?",
            list("Data and next pointer","Only data","Only pointer","Index"),
            "Data and next pointer", "LinkedList");
        quiz("Inserting at head of linked list is?",
            list("O(n)","O(1)","O(log n)","O(n²)"),
            "O(1)", "LinkedList");
        quiz("Floyd's cycle detection uses?",
            list("Two stacks","Fast and slow pointers","BFS","DFS"),
            "Fast and slow pointers", "LinkedList");
        quiz("Doubly linked list has?",
            list("One pointer","Two pointers (prev and next)","Three pointers","No pointers"),
            "Two pointers (prev and next)", "LinkedList");
        quiz("Reversing a linked list is?",
            list("O(1)","O(n)","O(n²)","O(log n)"),
            "O(n)", "LinkedList");

        // Stacks
        quiz("Stack follows?",
            list("FIFO","LIFO","Random","Sorted"),
            "LIFO", "Stacks");
        quiz("Stack push and pop are?",
            list("O(n)","O(1)","O(log n)","O(n²)"),
            "O(1)", "Stacks");
        quiz("Balanced parentheses uses?",
            list("Queue","Stack","Array","Tree"),
            "Stack", "Stacks");
        quiz("Monotonic stack maintains?",
            list("Random order","Increasing or decreasing order","Sorted order","Heap order"),
            "Increasing or decreasing order", "Stacks");
        quiz("Stack overflow occurs when?",
            list("Stack is empty","Stack exceeds capacity","Stack has one element","None"),
            "Stack exceeds capacity", "Stacks");

        // Queues
        quiz("Queue follows?",
            list("LIFO","FIFO","Random","Sorted"),
            "FIFO", "Queues");
        quiz("BFS uses which data structure?",
            list("Stack","Queue","Heap","Tree"),
            "Queue", "Queues");
        quiz("Circular queue solves?",
            list("Memory waste in linear queue","Sorting","Graph traversal","Tree search"),
            "Memory waste in linear queue", "Queues");
        quiz("Deque supports?",
            list("Insert/delete at both ends","Insert only at front","Delete only at rear","None"),
            "Insert/delete at both ends", "Queues");
        quiz("Priority queue is implemented using?",
            list("Array","Stack","Heap","Linked list"),
            "Heap", "Queues");

        // Sorting
        quiz("Bubble sort worst case is?",
            list("O(n)","O(n log n)","O(n²)","O(log n)"),
            "O(n²)", "Sorting");
        quiz("Merge sort time complexity is?",
            list("O(n²)","O(n log n)","O(n)","O(log n)"),
            "O(n log n)", "Sorting");
        quiz("Quick sort worst case is?",
            list("O(n log n)","O(n)","O(n²)","O(log n)"),
            "O(n²)", "Sorting");
        quiz("Which sort is stable?",
            list("Quick sort","Heap sort","Merge sort","Selection sort"),
            "Merge sort", "Sorting");
        quiz("Counting sort works best when?",
            list("Elements are large","Range of elements is small","Array is sorted","Array is random"),
            "Range of elements is small", "Sorting");

        // Searching
        quiz("Binary search requires array to be?",
            list("Unsorted","Sorted","Random","Linked"),
            "Sorted", "Searching");
        quiz("Linear search worst case is?",
            list("O(1)","O(log n)","O(n)","O(n²)"),
            "O(n)", "Searching");
        quiz("Binary search works on?",
            list("Linked list","Sorted array","Graph","Tree"),
            "Sorted array", "Searching");
        quiz("Binary search on answer is used for?",
            list("Finding exact value","Optimizing over a range","Sorting","Graph search"),
            "Optimizing over a range", "Searching");
        quiz("Binary search mid index is?",
            list("(low+high)/2","low+high","high-low","low*high"),
            "(low+high)/2", "Searching");

        // Trees
        quiz("Binary tree has at most?",
            list("1 child","2 children","3 children","Unlimited children"),
            "2 children", "Trees");
        quiz("Inorder traversal of BST gives?",
            list("Random order","Sorted order","Reverse order","Level order"),
            "Sorted order", "Trees");
        quiz("Height of balanced tree with n nodes is?",
            list("O(n)","O(n²)","O(log n)","O(1)"),
            "O(log n)", "Trees");
        quiz("Level order traversal uses?",
            list("Stack","Queue","Heap","Array"),
            "Queue", "Trees");
        quiz("BST search worst case (unbalanced) is?",
            list("O(1)","O(log n)","O(n)","O(n²)"),
            "O(n)", "Trees");

        // Heaps
        quiz("Min heap root contains?",
            list("Maximum element","Minimum element","Random element","Median"),
            "Minimum element", "Heaps");
        quiz("Heap insert time complexity is?",
            list("O(1)","O(n)","O(log n)","O(n²)"),
            "O(log n)", "Heaps");
        quiz("Heap is used to implement?",
            list("Stack","Queue","Priority queue","Linked list"),
            "Priority queue", "Heaps");
        quiz("Heapify operation is?",
            list("O(1)","O(n)","O(log n)","O(n²)"),
            "O(log n)", "Heaps");
        quiz("Top K elements problem uses?",
            list("Sorting only","Heap","Stack","Queue"),
            "Heap", "Heaps");

        // Graphs
        quiz("Graph edge connects?",
            list("Two nodes","Three nodes","One node","No nodes"),
            "Two nodes", "Graphs");
        quiz("BFS uses which structure?",
            list("Stack","Queue","Heap","Tree"),
            "Queue", "Graphs");
        quiz("DFS uses which structure?",
            list("Queue","Stack","Heap","Array"),
            "Stack", "Graphs");
        quiz("Topological sort applies to?",
            list("Undirected graphs","Directed acyclic graphs","Trees only","Weighted graphs"),
            "Directed acyclic graphs", "Graphs");
        quiz("Dijkstra finds?",
            list("Maximum path","Shortest path","All paths","Random path"),
            "Shortest path", "Graphs");
    }

    // ── HELPERS ───────────────────────────────────────────────────────────────

    private void u(int order, String title, String concept, String videoUrl, int duration, String difficulty) {
        Unit unit = new Unit();
        unit.setCourseId(DSA);
        unit.setTitle(title);
        unit.setConcept(concept);
        unit.setVideoUrl(videoUrl);
        unit.setDurationMinutes(duration);
        unit.setOrderIndex(order);
        unit.setDifficulty(difficulty);
        unit.setDomain("dsa");
        unitRepo.save(unit);
    }

    private void quiz(String question, List<String> options, String answer, String concept) {
        // Find the last saved unit with this concept
        List<Unit> units = unitRepo.findByConcept(concept);
        if (units.isEmpty()) return;
        // Attach to the last unit of this concept (most recently saved)
        String unitId = units.get(units.size() - 1).getId();

        // Only add if fewer than 5 quizzes already exist for this unit
        if (quizRepo.findByUnitId(unitId).size() >= 5) {
            // Attach to previous unit of same concept if available
            if (units.size() > 1) unitId = units.get(units.size() - 2).getId();
            else return;
        }

        UnitQuiz q = new UnitQuiz();
        q.setUnitId(unitId);
        q.setQuestion(question);
        q.setOptions(options);
        q.setCorrectAnswer(answer);
        quizRepo.save(q);
    }

    private List<String> list(String... items) { return Arrays.asList(items); }
}
