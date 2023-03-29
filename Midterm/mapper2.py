#!/usr/bin/env python
"""An advanced Reducer, using Python iterators and generators."""

from itertools import groupby
from operator import itemgetter
import sys
import os
import random

counter = 1

def main():
    
    global counter
    for line in sys.stdin:
        x= line.split()
        if x[len(x)-3]:
            y = x[len(x)-3]
            z = y[:(len(x)-2)]
            point = ","
            if z.endswith(point):
                if int(z[:1]) == counter:
                    num = random.randint(1, 10000)
                    if num < 3125:
                        #print(z[:1], len(z[:1]))
                        print(line)
            else:
                if int(z) == counter:
                    num = random.randint(1, 10000)
                    if num < 3125:
                        #print(z, len(z))
                        print(line)


if __name__ == "__main__":
    main()