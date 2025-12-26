#!/bin/sh
set -e

# Arguments: $1 = code file path, $2 = input file path, $3 = time limit (seconds), $4 = memory limit (MB)
CODE_FILE="$1"
INPUT_FILE="$2"
TIME_LIMIT="${3:-5}"
MEMORY_LIMIT="${4:-128}"

WORK_DIR="/sandbox/work"
cd "$WORK_DIR"

# Extract class name from code
CLASS_NAME=$(grep -oP 'public\s+class\s+\K\w+' "$CODE_FILE" | head -1)
if [ -z "$CLASS_NAME" ]; then
    echo '{"success":false,"phase":"parse","error":"Could not find public class declaration"}'
    exit 0
fi

# Copy source file with correct name
cp "$CODE_FILE" "${CLASS_NAME}.java"

# Compile with timeout
COMPILE_OUTPUT=$(timeout 10s javac -Xlint:all "${CLASS_NAME}.java" 2>&1) || {
    COMPILE_EXIT=$?
    if [ $COMPILE_EXIT -eq 124 ]; then
        echo '{"success":false,"phase":"compile","error":"Compilation timed out"}'
    else
        # Escape JSON special characters
        ESCAPED_OUTPUT=$(echo "$COMPILE_OUTPUT" | sed 's/\\/\\\\/g' | sed 's/"/\\"/g' | sed ':a;N;$!ba;s/\n/\\n/g')
        echo "{\"success\":false,\"phase\":\"compile\",\"error\":\"$ESCAPED_OUTPUT\"}"
    fi
    exit 0
}

# Run with timeout and memory limit
START_TIME=$(date +%s%3N)

RUN_OUTPUT=$(timeout "${TIME_LIMIT}s" java -Xmx"${MEMORY_LIMIT}m" -Xms16m \
    -XX:+UseSerialGC \
    -Djava.security.manager=allow \
    "$CLASS_NAME" < "$INPUT_FILE" 2>&1) || {
    RUN_EXIT=$?
    END_TIME=$(date +%s%3N)
    DURATION=$((END_TIME - START_TIME))

    if [ $RUN_EXIT -eq 124 ]; then
        echo "{\"success\":false,\"phase\":\"runtime\",\"error\":\"Execution timed out after ${TIME_LIMIT}s\",\"executionMs\":$DURATION}"
    else
        ESCAPED_OUTPUT=$(echo "$RUN_OUTPUT" | sed 's/\\/\\\\/g' | sed 's/"/\\"/g' | sed ':a;N;$!ba;s/\n/\\n/g')
        echo "{\"success\":false,\"phase\":\"runtime\",\"error\":\"$ESCAPED_OUTPUT\",\"executionMs\":$DURATION}"
    fi
    exit 0
}

END_TIME=$(date +%s%3N)
DURATION=$((END_TIME - START_TIME))

# Escape output for JSON
ESCAPED_OUTPUT=$(echo "$RUN_OUTPUT" | sed 's/\\/\\\\/g' | sed 's/"/\\"/g' | sed ':a;N;$!ba;s/\n/\\n/g')
echo "{\"success\":true,\"phase\":\"complete\",\"output\":\"$ESCAPED_OUTPUT\",\"executionMs\":$DURATION}"
