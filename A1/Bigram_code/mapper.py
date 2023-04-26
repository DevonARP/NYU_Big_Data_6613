#!/usr/bin/env python
"""An advanced Mapper, using Python iterators and generators."""

import sys

#Returns lines to Hadoop which will be in standard input
def read_input(input):
    for line in input:
        yield line.split()


def main(separator='\t'):
    data = read_input(sys.stdin)
    punc = '''!()-[]{};:'"\,<>./?@#$%^&*_~''' 
    
    strline = ""
    term=""
    
    for line in data: #lines
        for word in line: #word
            for i in word: #letters
                if i in punc: #replaces punctations with spaces
                    word = word.replace(i, " ")
            strline = strline + " " + word
            #print('%s%s%d' % (new_word.lower(), separator, 1))

    firststrline = strline.split()
    firststrline.pop(0)
    secondstrline = strline.split()
    secondstrline.pop()
    for i in range(len(firststrline)):
        term = secondstrline[i] + " " + firststrline[i]
        print('%s%s%d' % (term, separator, 1))

#Run program
if __name__ == "__main__":
    main()
