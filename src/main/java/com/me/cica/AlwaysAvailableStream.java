package com.me.cica;

import java.io.IOException;
import java.io.InputStream;

/*
    A workaround for https://bugs.openjdk.java.net/browse/JDK-8081450.
    A single CommonCrawl WARC file is a concatenation of multiple archives.
    This bug affects only HTTP connection streams - not when reading from local file.
    The HTTPInputStream#available() method returns the number of bytes available before a blocking IO call must be made to
    refill the buffer. This is interpreted by the GZip stream as no more bytes being available and the stream closes
    prematurely.
 */
class AlwaysAvailableStream extends InputStream {
    private final InputStream is;

    AlwaysAvailableStream(final InputStream inputstream) {
        is = inputstream;
    }

    public int read() throws IOException {
        return is.read();
    }

    public int read(byte[] b) throws IOException {
        return is.read(b);
    }

    public int read(byte[] b, int off, int len) throws IOException {
        return is.read(b, off, len);
    }

    public void close() throws IOException {
        is.close();
    }

    public int available() throws IOException {
        // Report a byte being available, even when the underlying stream reports none.
        return is.available() == 0 ? 1 : is.available();
    }
}