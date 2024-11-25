function setupInputs() {
    const selectedQuestion = document.getElementById("questionSelect").value;
    const inputsDiv = document.getElementById("inputs");

    inputsDiv.innerHTML = ""; // Clear previous inputs

    switch (selectedQuestion) {
        case "q1":
            inputsDiv.innerHTML = `<label>Input Sequence:</label><input type="text" id="inputSeq" placeholder="e.g., 001101">`;
            break;
        case "q2":
            inputsDiv.innerHTML = `<label>Enter Timers (t1, t2):</label><input type="text" id="timers" placeholder="e.g., 5,3">`;
            break;
        case "q3":
            inputsDiv.innerHTML = `<label>Votes:</label><input type="text" id="votes" placeholder="e.g., 1,2,3,3,2">`;
            break;
        case "q4":
            inputsDiv.innerHTML = `<label>Start Time (HH:MM:SS):</label><input type="text" id="startTime" placeholder="e.g., 12:30:45">`;
            break;
        case "q5":
            inputsDiv.innerHTML = `<label>Calculator Inputs (a,b,op):</label><input type="text" id="calcInput" placeholder="e.g., 5,3,+">`;
            break;
        case "q6":
            inputsDiv.innerHTML = `<label>Binary Data:</label><input type="text" id="parityInput" placeholder="e.g., 110101">`;
            break;
        case "q7":
            inputsDiv.innerHTML = `<label>Binary Numbers (a,b):</label><input type="text" id="binaryInput" placeholder="e.g., 1011,1100">`;
            break;
        case "q8":
            inputsDiv.innerHTML = `<label>Comparator Inputs (a,b):</label><input type="text" id="compInput" placeholder="e.g., 8,5">`;
            break;
        default:
            inputsDiv.innerHTML = `Please select a valid question.`;
    }
}


function runQuestion() {
    const selectedQuestion = document.getElementById("questionSelect").value;
    const outputBox = document.getElementById("output");
    const verilogBox = document.getElementById("verilogCode");

    switch (selectedQuestion) {
        case "q1":
            const inputSeq = document.getElementById("inputSeq").value;
            outputBox.value = fsmSequenceDetector(inputSeq);
            verilogBox.value = verilogFSMSequenceDetector();
            break;
        case "q2":
            const timers = document.getElementById("timers").value.split(",");
            outputBox.value = trafficLightController(parseInt(timers[0]), parseInt(timers[1]));
            verilogBox.value = verilogTrafficLightController();
            break;
        case "q3":
            const votes = document.getElementById("votes").value.split(",");
            outputBox.value = simulateVoting(votes);
            verilogBox.value = verilogVotingMachine();
            break;
        case "q4":
            const startTime = document.getElementById("startTime").value;
            outputBox.value = simulateClock(startTime);
            verilogBox.value = verilogDigitalClock();
            break;
        case "q5":
            const calcInput = document.getElementById("calcInput").value.split(",");
            outputBox.value = calculator(parseInt(calcInput[0]), parseInt(calcInput[1]), calcInput[2]);
            verilogBox.value = verilogCalculator();
            break;
        case "q6":
            const parityInput = document.getElementById("parityInput").value;
            outputBox.value = parityGenerator(parityInput);
            verilogBox.value = verilogParityGenerator();
            break;
        case "q7":
            const binaryInput = document.getElementById("binaryInput").value.split(",");
            outputBox.value = serialAdder(binaryInput[0], binaryInput[1]);
            verilogBox.value = verilogSerialAdder();
            break;
        case "q8":
            const compInput = document.getElementById("compInput").value.split(",");
            outputBox.value = comparator(parseInt(compInput[0]), parseInt(compInput[1]));
            verilogBox.value = verilogComparator();
            break;
        default:
            outputBox.value = "Please select a valid question and provide inputs.";
            verilogBox.value = "";
    }
}

// Solution Functions
function fsmSequenceDetector(seq) {
    let state = "S0", z = 0, output = "Output Sequence: ";
    for (let w of seq) {
        switch (state) {
            case "S0": state = w === "0" ? "S1" : "S2"; break;
            case "S1": state = w === "0" ? "S0" : "S3"; break;
            case "S2": state = w === "0" ? "S3" : "S0"; break;
            case "S3": state = w === "0" ? "S2" : "S1"; break;
        }
        z = (state === "S0" || state === "S3") ? 1 : 0;
        output += z;
    }
    return output;
}

function trafficLightController(t1, t2) {
    return `Traffic Light Sequence:\nRoad 1: Green (${t1}s) -> Yellow (3s) -> Red (${t2}s)\nRoad 2: Red (${t1}s) -> Green (${t2}s) -> Yellow (3s)`;
}

function simulateVoting(votes) {
    const counts = {};
    votes.forEach(v => counts[v] = (counts[v] || 0) + 1);
    return Object.entries(counts).map(([c, n]) => `Candidate ${c}: ${n} votes`).join("\n");
}

function simulateClock(startTime) {
    const [h, m, s] = startTime.split(":").map(Number);
    if (h >= 24 || m >= 60 || s >= 60) return "Invalid time format";
    let time = new Date(1970, 0, 1, h, m, s), result = "Clock Simulation:\n";
    for (let i = 0; i < 10; i++) {
        time.setSeconds(time.getSeconds() + 1);
        result += time.toTimeString().split(" ")[0] + "\n";
    }
    return result;
}

function calculator(a, b, op) {
    return { "+": a + b, "-": a - b, "*": a * b }[op] || "Invalid operation";
}

function parityGenerator(data) {
    const ones = [...data].filter(b => b === "1").length;
    return `Parity: ${ones % 2 === 0 ? "Even (0)" : "Odd (1)"}`;
}

function serialAdder(a, b) {
    let carry = 0, result = "";
    for (let i = a.length - 1; i >= 0; i--) {
        const sum = +a[i] + +b[i] + carry;
        result = (sum % 2) + result;
        carry = Math.floor(sum / 2);
    }
    return carry ? carry + result : result;
}

function comparator(a, b) {
    return a === b ? "Equal" : a > b ? "A > B" : "A < B";
}

// Verilog Code Functions
function verilogFSMSequenceDetector() {
    return `
module FSM_Detector(input clk, reset, w, output reg z);
reg [1:0] state;
    parameter S0 = 2'b00, S1 = 2'b01, S2 = 2'b10, S3 = 2'b11;

    always @(posedge clk or posedge reset) begin
        if (reset) 
            state <= S0;
        else 
            case (state)
                S0: state <= (w == 0) ? S1 : S2;
                S1: state <= (w == 0) ? S0 : S3;
                S2: state <= (w == 0) ? S3 : S0;
                S3: state <= (w == 0) ? S2 : S1;
            endcase
    end

    always @(state) begin
        z = (state == S0 || state == S3) ? 1 : 0;
    end
endmodule
    `;
}

function verilogTrafficLightController() {
    return `
module TrafficLightController(input clk, reset, output reg G1, Y1, R1, G2, Y2, R2);
input clk, reset,
    output reg [2:0] Road1, Road2
);
    reg [1:0] state;
    parameter G1 = 2'b00, Y1 = 2'b01, G2 = 2'b10, Y2 = 2'b11;

    always @(posedge clk or posedge reset) begin
        if (reset)
            state <= G1;
        else
            case (state)
                G1: state <= Y1;
                Y1: state <= G2;
                G2: state <= Y2;
                Y2: state <= G1;
            endcase
    end

    always @(state) begin
        case (state)
            G1: {Road1, Road2} = {3'b100, 3'b001}; // Road1: Green, Road2: Red
            Y1: {Road1, Road2} = {3'b010, 3'b001}; // Road1: Yellow, Road2: Red
            G2: {Road1, Road2} = {3'b001, 3'b100}; // Road1: Red, Road2: Green
            Y2: {Road1, Road2} = {3'b001, 3'b010}; // Road1: Red, Road2: Yellow
        endcase
    end
endmodule
    `;
}

function verilogVotingMachine() {
    return `
module VotingMachineControl(
    input start,
    input [3:0] voter_count,       // Max 10 voters (binary representation of count)
    input [3:0] candidate_selection, // Candidate selected by voter
    input [3:0] passcode,           // Entered passcode for viewing results
    output reg [3:0] winner         // Displays winning candidate or tie
);
    // Internal signals for state and communication with other modules
    reg voting_active;
    wire [3:0] current_winner;
    wire passcode_verified;

    // Instantiate voting, passcode, and display modules
    VotingModule voting(.start(voting_active), .voter_count(voter_count), .candidate_selection(candidate_selection));
    PasscodeModule pass(.input_passcode(passcode), .verified(passcode_verified));
    ResultDisplay display(.winner(current_winner), .verified(passcode_verified));

    // Control logic for start, stop, and display results
    always @(posedge start) begin
        if (voter_count > 0)
            voting_active = 1;
    end
    
    always @(posedge passcode_verified) begin
        winner = current_winner; // Display result after passcode verification
    end
endmodule

//Voting module
module VotingModule(
    input start,
    input [3:0] voter_count,
    input [3:0] candidate_selection,
    output reg [3:0] vote_counts[9:0] // Array of counters for up to 10 candidates
);
    reg [3:0] votes_cast;

    always @(posedge start) begin
        if (votes_cast < voter_count) begin
            vote_counts[candidate_selection] = vote_counts[candidate_selection] + 1;
            votes_cast = votes_cast + 1;
        end
    end
endmodule

//Passcode verification module
module PasscodeModule(
    input [3:0] input_passcode,
    output reg verified
);
    parameter [3:0] correct_passcode = 4'b1101; // Example passcode

    always @(*) begin
        if (input_passcode == correct_passcode)
            verified = 1;
        else
            verified = 0;
    end
endmodule

//Result display module
module ResultDisplay(
    input [3:0] vote_counts[9:0],
    input verified,
    output reg [3:0] winner
);
    integer i;
    reg [3:0] max_votes = 0;
    reg [3:0] tie_check = 0;

    always @(posedge verified) begin
        for (i = 0; i < 10; i = i + 1) begin
            if (vote_counts[i] > max_votes) begin
                max_votes = vote_counts[i];
                winner = i;
                tie_check = 0;
            end else if (vote_counts[i] == max_votes) begin
                tie_check = 1; // Set tie flag
            end
        end
        if (tie_check)
            winner = 4'b1111; // Indicate a tie if multiple candidates have max votes
    end
endmodule

    `;
}

function verilogDigitalClock() {
    return `
module DigitalClock_23BEC0043(
    input clk,         // High-frequency system clock (e.g., 50 MHz)
    input reset,       // Active-high reset signal
    output reg [4:0] hours,   // 5 bits to count up to 23 (24-hour format)
    output reg [5:0] minutes, // 6 bits to count up to 59
    output reg [5:0] seconds  // 6 bits to count up to 59
);

    // Parameters for frequency division to 1 Hz (assuming clk is 50 MHz)
    parameter CLOCK_DIVIDE = 50_000_000; // Divide 50 MHz clock to 1 Hz

    reg [25:0] count; // Counter for frequency divider (26 bits)

    // Frequency Divider for 1 Hz signal
    always @(posedge clk or posedge reset) begin
        if (reset) begin
            count <= 0;
        end else if (count == CLOCK_DIVIDE - 1) begin
            count <= 0;
        end else begin
            count <= count + 1;
        end
    end

    // Generate 1 Hz clock enable signal
    wire clk_1hz_enable = (count == CLOCK_DIVIDE - 1);

    // Seconds Counter
    always @(posedge clk or posedge reset) begin
        if (reset) begin
            seconds <= 0;
        end else if (clk_1hz_enable) begin
            if (seconds == 59) begin
                seconds <= 0;
            end else begin
                seconds <= seconds + 1;
            end
        end
    end

    // Minutes Counter
    always @(posedge clk or posedge reset) begin
        if (reset) begin
            minutes <= 0;
        end else if (clk_1hz_enable && seconds == 59) begin
            if (minutes == 59) begin
                minutes <= 0;
            end else begin
                minutes <= minutes + 1;
            end
        end
    end

    // Hours Counter
    always @(posedge clk or posedge reset) begin
        if (reset) begin
            hours <= 0;
        end else if (clk_1hz_enable && seconds == 59 && minutes == 59) begin
            if (hours == 23) begin
                hours <= 0;
            end else begin
                hours <= hours + 1;
            end
        end
    end
endmodule

timescale 1ns/1ps

module DigitalClock_23BEC0043_tb;

    // Testbench signals
    reg clk;            // Clock signal for simulation
    reg reset;          // Reset signal
    wire [4:0] hours;   // Output hours
    wire [5:0] minutes; // Output minutes
    wire [5:0] seconds; // Output seconds

    // Instantiate the Digital Clock module
    DigitalClock_23BEC0043 uut (
        .clk(clk),
        .reset(reset),
        .hours(hours),
        .minutes(minutes),
        .seconds(seconds)
    );

    // Clock generation (1 Hz simulation) for the testbench
    initial begin
        clk = 0;
        forever #10 clk = ~clk; // Toggle clk every 10 ns to simulate clock
    end

    // Simulation
    initial begin
        // Initialize the reset signal
        reset = 1;
        #20;                 // Hold reset high for 20 ns
        reset = 0;           // Release reset

        // Wait for a few seconds (simulated time)
        #1000000;            // Simulate 1,000,000 ns or 1 ms to observe initial counts

        // Test Full Day Cycle
        #86400000000; // Run for 24 hours (24 * 60 * 60 * 1,000,000 ns = 86400000000 ns)

        $finish;
    end

    // Monitor output signals
    initial begin
$display(" Theory sl.no.: 14 | Reg.no.23BEC0043 |  Name: Gautham" );
 $display("-----------------------------------------------------------------  " );
 $display(" Output of Verilog  code for 24 hour digital clock ");
                $display("_______________________________________________________________________");


        $monitor("Time: %0t | Hours: %0d | Minutes: %0d | Seconds: %0d", $time, hours, minutes, seconds);
    end

endmodule

    `;
}

function verilogCalculator() {
    return `
module Calculator (
    input wire [7:0] A,                // 8-bit input operand 1
    input wire [7:0] B,                // 8-bit input operand 2
    input wire [2:0] operation,        // 3-bit control signal to select operation
    output reg [15:0] result,          // 16-bit output for the result
    output reg overflow                // Overflow flag for signed operations
);

    // Internal registers for signed versions of A and B
    wire signed [7:0] signed_A = A;
    wire signed [7:0] signed_B = B;

    always @(*) begin
        overflow = 0;                  // Default overflow to 0
        case (operation)
            3'b000: begin              // Unsigned Addition
                result = A + B;
            end

            3'b001: begin              // Unsigned Subtraction
                result = A - B;
            end

            3'b010: begin              // Signed Addition
                result = signed_A + signed_B;
                // Check for overflow in signed addition
                overflow = ((signed_A[7] == signed_B[7]) && (result[7] != signed_A[7]));
            end

            3'b011: begin              // Signed Subtraction
                result = signed_A - signed_B;
                // Check for overflow in signed subtraction
                overflow = ((signed_A[7] != signed_B[7]) && (result[7] != signed_A[7]));
            end

            3'b100: begin              // Unsigned Multiplication
                result = A * B;
            end

            3'b101: begin              // Signed Multiplication
                result = signed_A * signed_B;
                // Overflow detection not usually required for multiplication since result is 16 bits
            end

            default: begin             // Default case if invalid operation
                result = 16'b0;
                overflow = 1'b0;
            end
        endcase
    end

endmodule

module Calculator_tb;

    // Declare testbench signals
    reg [7:0] A;                     // 8-bit input operand 1
    reg [7:0] B;                     // 8-bit input operand 2
    reg [2:0] operation;             // 3-bit control signal for operation
    wire [15:0] result;              // 16-bit result output
    wire overflow;                   // Overflow flag for signed operations

    // Instantiate the Calculator module
    Calculator calculator (
        .A(A),
        .B(B),
        .operation(operation),
        .result(result),
        .overflow(overflow)
    );

    // Test procedure
    initial begin
        // Display header
        $display("A       B       Operation   Result      Overflow");

        // Test unsigned addition
        A = 8'd50; B = 8'd75; operation = 3'b000; #10;
        $display("%d      %d        000         %d         %b", A, B, result, overflow);

        // Test unsigned subtraction
        A = 8'd100; B = 8'd25; operation = 3'b001; #10;
        $display("%d      %d        001         %d         %b", A, B, result, overflow);

        // Test signed addition with no overflow
        A = 8'd50; B = 8'd25; operation = 3'b010; #10;
        $display("%d      %d        010         %d         %b", A, B, result, overflow);

        // Test signed addition with overflow
        A = 8'd127; B = 8'd1; operation = 3'b010; #10;
        $display("%d      %d        010         %d         %b", A, B, result, overflow);

        // Test signed subtraction with no overflow
        A = 8'd50; B = 8'd25; operation = 3'b011; #10;
        $display("%d      %d        011         %d         %b", A, B, result, overflow);

        // Test signed subtraction with overflow
        A = 8'd128; B = 8'd255; operation = 3'b011; #10;
        $display("%d      %d        011         %d         %b", A, B, result, overflow);

        // Test unsigned multiplication
        A = 8'd10; B = 8'd15; operation = 3'b100; #10;
        $display("%d      %d        100         %d         %b", A, B, result, overflow);

        // Test signed multiplication with positive numbers
        A = 8'd12; B = 8'd3; operation = 3'b101; #10;
        $display("%d      %d        101         %d         %b", A, B, result, overflow);

        // Test signed multiplication with one negative number
        A = 8'd255; B = 8'd2; operation = 3'b101; #10; // -1 * 2 = -2
        $display("%d      %d        101         %d         %b", A, B, result, overflow);

        // Test signed multiplication with two negative numbers
        A = 8'd255; B = 8'd255; operation = 3'b101; #10; // -1 * -1 = 1
        $display("%d      %d        101         %d         %b", A, B, result, overflow);

        // End of test
        $finish;
    end

endmodule

    `;
}

function verilogParityGenerator() {
    return `
module parity(
input x,y,z,
output result);
xor (result,x,y,z);
endmodule
PARITY CHECKER
module Odd_Parity_Checker (
    input wire [7:0] data_in,  // 8-bit data input
    output wire parity     );    // Parity output (1 if odd parity, 0 if even parity)
    assign parity = ~(^data_in);
endmodule
module Parity_Checker_tb;
    reg [7:0] data_in;           // Test input data
    wire even_parity;            // Output of Even Parity Checker
    wire odd_parity;             // Output of Odd Parity Checker
    Even_Parity_Checker even_parity_checker (
        .data_in(data_in),
        .parity(even_parity)  );
    Odd_Parity_Checker odd_parity_checker (
        .data_in(data_in),
        .parity(odd_parity)  );
    initial begin
        $display("Data In       | Even Parity | Odd Parity");
        $display("---------------------------------------");
        // Test different data patterns
        data_in = 8'b00000000; #10; // 0 ones - Even parity expected
        $display("%b |     %b      |     %b", data_in, even_parity, odd_parity);
        data_in = 8'b00000001; #10; // 1 one - Odd parity expected
        $display("%b |     %b      |     %b", data_in, even_parity, odd_parity);
        data_in = 8'b00000011; #10; // 2 ones - Even parity expected
        $display("%b |     %b      |     %b", data_in, even_parity, odd_parity);
        data_in = 8'b00000111; #10; // 3 ones - Odd parity expected
        $display("%b |     %b      |     %b", data_in, even_parity, odd_parity);
        data_in = 8'b10101010; #10; // 4 ones - Even parity expected
        $display("%b |     %b      |     %b", data_in, even_parity, odd_parity);
        data_in = 8'b11111111; #10; // 8 ones - Even parity expected
        $display("%b |     %b      |     %b", data_in, even_parity, odd_parity);
        data_in = 8'b11010101; #10; // 5 ones - Odd parity expected
        $display("%b |     %b      |     %b", data_in, even_parity, odd_parity);
        data_in = 8'b10011001; #10; // 4 ones - Even parity expected
        $display("%b |     %b      |     %b", data_in, even_parity, odd_parity);
        $finish;
    end
endmodule

    `;
}

function verilogSerialAdder() {
    return `
module SerialAdder(input clk, reset, [7:0] a, b, output [8:0] sum);
    input clk, reset,
    input a, b,
    output reg sum, carry_out
);
    reg carry;
    always @(posedge clk or posedge reset) begin
        if (reset) begin
            sum <= 0;
            carry <= 0;
        end else begin
            {carry, sum} <= a + b + carry;
        end
    end
    assign carry_out = carry;
endmodule
    `;
}

function verilogComparator() {
    return `
module Comparator(input [3:0] a, b, output greater, equal, less);
    input [3:0] a, b,
    output reg greater, equal, less
);
    always @(*) begin
        if (a > b) {greater, equal, less} = 3'b100;
        else if (a == b) {greater, equal, less} = 3'b010;
        else {greater, equal, less} = 3'b001;
    end
endmodule
    `;
}
function setupInputs() {
    const selectedQuestion = document.getElementById("questionSelect").value;
    const inputsDiv = document.getElementById("inputs");

    inputsDiv.innerHTML = ""; // Clear previous inputs

    switch (selectedQuestion) {
        case "q1":
            inputsDiv.innerHTML = `
                <label>Input Sequence:</label>
                <input type="text" id="inputSeq" placeholder="e.g., 001101">
                <img src="seq_det_1.png" alt="FSM Sequence Detector">
                <img src="seq_det_2.png" alt="FSM Sequence Detector">
            `;
            break;
        case "q2":
            inputsDiv.innerHTML = `
                <label>Enter Timers (t1, t2):</label>
                <input type="text" id="timers" placeholder="e.g., 5,3">
                <img src="traffic_1.png" alt="Traffic Light Controller">
            `;
            break;
        case "q3":
            inputsDiv.innerHTML = `
                <label>Votes:</label>
                <input type="text" id="votes" placeholder="e.g., 1,2,3,3,2">
            `;
            break;
        case "q4":
            inputsDiv.innerHTML = `
                <label>Start Time (HH:MM:SS):</label>
                <input type="text" id="startTime" placeholder="e.g., 12:30:45">
                <img src="clock.png" alt="24-hour Digital Clock">
            `;
            break;
        case "q5":
            inputsDiv.innerHTML = `
                <label>Calculator Inputs (a,b,op):</label>
                <input type="text" id="calcInput" placeholder="e.g., 5,3,+">
            `;
            break;
        case "q6":
            inputsDiv.innerHTML = `
                <label>Binary Data:</label>
                <input type="text" id="parityInput" placeholder="e.g., 110101">
            `;
            break;
        case "q7":
            inputsDiv.innerHTML = `
                <label>Binary Numbers (a,b):</label>
                <input type="text" id="binaryInput" placeholder="e.g., 1011,1100">
                <img src="Serial_Adder_0.png" alt="Serial Adder">
                <img src="Serial_Adder_1.png" alt="Serial Adder">
            `;
            break;
        case "q8":
            inputsDiv.innerHTML = `
                <label>Comparator Inputs (a,b):</label>
                <img src="comp1.png" alt="Comparator">
                <input type="text" id="compInput" placeholder="e.g., 8,5">
                <img src="comp2.png" alt="Comparator">
                <img src="comparator.png" alt="Comparator">
            `;
            break;
        default:
            inputsDiv.innerHTML = "Please select a valid question.";
    }
}
