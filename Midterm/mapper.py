#!/usr/bin/env python
"""An advanced Mapper, using Python iterators and generators."""

import csv
import random
import sys
import os

reservoir=[]
counter=random.randint(1, 191)
    
def main():
    
    global reservoir
    global counter
    
    for file in sys.stdin:
        if counter<191: #Got 191 from the total number of rows divided by 50000
            reservoir.append(file)
        #elif counter>191: #Shouldn't really need this because of the splits being accoutned for
            #prob = 191/counter
            #reservoir[random.choice(range(0,(191)))] = file
        counter = counter+1
        sys.stderr.write("reporter:counter:HW1,rows,1\n")
        rows = os.getenv("rows")
        print(file[0:50],counter," ")
        if counter == 191:
            counter=0


#Run program
if __name__ == "__main__":
    main()