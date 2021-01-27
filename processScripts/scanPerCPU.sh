#!/bin/bash
java -jar -Djna.library.path=/usr/local/lib target/ackeywordscanner-1.0-jar-with-dependencies.jar scanPerCPU $1 $2
