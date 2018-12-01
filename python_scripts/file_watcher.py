#!/usr/bin/env python3

import os
import shutil
from argparse import ArgumentParser

from watchdog.events import FileSystemEventHandler
from watchdog.observers import Observer


class EventHandler(FileSystemEventHandler):
    def __init__(self, destination):
        self.destination = destination

    def on_created(self, event):
        shutil.move(event.src_path, self.destination)


if __name__ == '__main__':
    parser = ArgumentParser(description=('Watch for new files and move them'))
    parser.add_argument('source', type=str,
                        help='path to watch for new files')
    parser.add_argument('destination', type=str,
                        help='path to which to move the files')

    args = parser.parse_args()

    observer = Observer()
    event_handler = EventHandler(args.destination)
    observer.schedule(event_handler, args.source)
    observer.start()
    observer.join()
