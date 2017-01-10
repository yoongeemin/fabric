#!/usr/bin/env python
import json
import sys
import os

args = sys.argv
path = os.path.join(os.path.dirname(__file__), args[1])
try:
    config = json.load(open(path, 'r'))
    config['PLATFORM'] = 'IOS'
    mapper = lambda (x,y): '@"{}": @"{}"'.format(x, y)
    dictionary = ','.join(map(mapper, config.iteritems()))
    result = '#define ENV @{{{}}}'.format(dictionary)

    output = open('./Environment.m', 'w')
    output.write(result)
    output.close()

except ValueError:
  print 'Invalid configuration file'
